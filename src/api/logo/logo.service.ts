import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logo } from 'src/core/model/logo.model';
import { FileService } from '../file/file.service';
import { chunkData } from 'src/infrastructure/lib/functions/chunkArray';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LogoService {
  constructor(
    @InjectModel(Logo) private readonly repository: typeof Logo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async uploadLogo(file: any): Promise<object> {
    const image = await this.fileService.createFile(file);
    const logo = await this.repository.create({
      logo: image,
    });
    return {
      data: logo,
      status: 201,
      message: 'Logo uploaded successfully',
    };
  }

  async getAllLogos(): Promise<object> {
    const cached_data = await this.cacheManager.get('logos');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All logos are fetched',
      };
    }
    const logos: any = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('logos', logos, 60);
    let chunked_data = await chunkData(logos);
    return {
      data: chunked_data,
      status: 200,
      message: 'All logos are fetched',
    };
  }

  async paginationLogos(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const logos = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: logos,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Logos are fetched with pagination',
    };
  }

  async getLogoByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('logo');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Logo is fetched by ID',
      };
    }
    const logo = await this.getOne(id);
    await this.cacheManager.set('logo', logo, 60);
    return {
      data: logo,
      status: 200,
      message: 'Logo is fetched by ID',
    };
  }

  async deleteLogo(id: number): Promise<object> {
    const logo = await this.getOne(id);
    await this.fileService.deleteFile(logo.logo);
    await logo.destroy();
    return {
      status: 200,
      message: 'Logo deleted successfully',
    };
  }

  async getOne(id: number): Promise<Logo> {
    const logo = await this.repository.findByPk(id);
    if (!logo) {
      throw new NotFoundException('Logo not found!');
    }
    return logo;
  }
}

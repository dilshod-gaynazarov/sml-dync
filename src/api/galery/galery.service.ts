import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Galery } from 'src/core/model/galery.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from '../file/file.service';
import { CreateGaleryDto } from './dto/create-galery.dto';
import { UpdateGaleryDto } from './dto/update-galery.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GaleryService {
  constructor(
    @InjectModel(Galery) private readonly repository: typeof Galery,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async createGalery(dto: CreateGaleryDto, file: any): Promise<object> {
    const photo = await this.fileService.createFile(file);
    const galery = await this.repository.create({ photo, ...dto });
    return {
      data: galery,
      status: 201,
      message: 'Galery created successfully',
    };
  }

  async getAllGaleries(): Promise<object> {
    const cached_data = await this.cacheManager.get('galeries');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All galeries are fetched',
      };
    }
    const galeries = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('galeries', galeries, 60);
    return {
      data: galeries,
      status: 200,
      message: 'All galeries are fetched',
    };
  }

  async paginationGaleries(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const galeries = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: galeries,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Galeries are fetched with pagination',
    };
  }

  async getGaleryByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('galery');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Galery is fetched by ID',
      };
    }
    const galery = await this.getOne(id);
    await this.cacheManager.set('galery', galery, 60);
    return {
      data: galery,
      status: 200,
      message: 'Galery is fetched by ID',
    };
  }

  async updateGalery(
    id: number,
    dto: UpdateGaleryDto,
    file: any,
  ): Promise<object> {
    const galery = await this.getOne(id);
    let updated_info: any;
    if (file) {
      await this.fileService.deleteFile(galery.photo);
      const photo = await this.fileService.createFile(file);
      updated_info = await this.repository.update(
        { photo, ...dto },
        { where: { id }, returning: true },
      );
    } else {
      updated_info = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });
    }
    return {
      data: updated_info[1][0],
      status: 200,
      message: 'Galery edited successfully',
    };
  }

  async deleteGalery(id: number): Promise<object> {
    const galery = await this.getOne(id);
    await this.fileService.deleteFile(galery.photo);
    await galery.destroy();
    return {
      status: 200,
      message: 'Galery deleted successfully',
    };
  }

  async getOne(id: number): Promise<Galery> {
    const galery = await this.repository.findByPk(id);
    if (!galery) {
      throw new NotFoundException('Galery not found!');
    }
    return galery;
  }
}

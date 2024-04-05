import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from 'src/core/model/image.model';
import { FileService } from '../file/file.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image) private readonly repository: typeof Image,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async uploadImage(file: any): Promise<object> {
    const image = await this.fileService.createFile(file);
    const uploaded = await this.repository.create({ image });
    return {
      data: uploaded,
      status: 201,
      message: 'File uploaded successfully',
    };
  }

  async getAllImages(): Promise<object> {
    const cached_data = await this.cacheManager.get('files');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All files are fetched',
      };
    }
    const images = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('files', images, 60);
    return {
      data: images,
      status: 200,
      message: 'All files are fetched',
    };
  }

  async paginationImages(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const images = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: images,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Images are fetched with pagination',
    };
  }

  async getImageByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('file');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'File is fetched by ID',
      };
    }
    const image = await this.getOne(id);
    await this.cacheManager.set('file', image, 60);
    return {
      data: image,
      status: 200,
      message: 'File is fetched by ID',
    };
  }

  async updateImage(id: number, file: any): Promise<object> {
    const image = await this.getOne(id);
    await this.fileService.deleteFile(image.image);
    const uploaded = await this.fileService.createFile(file);
    const updated_info = await this.repository.update(
      { image: uploaded },
      { where: { id }, returning: true },
    );
    return {
      data: updated_info[1][0],
      status: 200,
      message: 'File edited successfully',
    };
  }

  async deleteImage(id: number): Promise<object> {
    const image = await this.getOne(id);
    await this.fileService.deleteFile(image.image);
    await image.destroy();
    return {
      status: 200,
      message: 'File deleted successfully',
    };
  }

  async getOne(id: number): Promise<Image> {
    const image = await this.repository.findByPk(id);
    if (!image) {
      throw new NotFoundException('File not found!');
    }
    return image;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { News } from 'src/core/model/news.model';
import { FileService } from '../file/file.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Op } from 'sequelize';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News) private readonly repository: typeof News,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async createNews(dto: CreateNewsDto, file: any): Promise<object> {
    const image = await this.fileService.createFile(file);
    const news = await this.repository.create({ image, ...dto });
    return {
      data: news,
      status: 201,
      message: 'News created successfully',
    };
  }

  async getAllNews(req?: Request): Promise<object> {
    const lang = req?.headers?.lang;
    const cached_data = await this.cacheManager.get('news');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All news are fetched',
      };
    }
    let news: any;
    if (!lang) {
      news = await this.repository.findAll({ order: [['createdAt', 'DESC']] });
    } else {
      news = await this.repository.findAll({
        where: { lang },
        order: [['createdAt', 'DESC']],
      });
    }
    await this.cacheManager.set('news', news, 60);
    return {
      data: news,
      status: 200,
      message: 'All news are fetched',
    };
  }

  async paginationNews(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const news = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: news,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'News are fetched with pagination',
    };
  }

  async getNewsByID(id: number, req: Request): Promise<object> {
    const lang = req?.headers?.lang;
    const cached_data = await this.cacheManager.get('new');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'News fetched by ID',
      };
    }
    let news: any;
    if (!lang) {
      news = null;
    } else {
      news = await this.repository.findOne({
        where: { [Op.and]: [{ id }, { lang }] },
      });
    }
    await this.cacheManager.set('new', news, 60);
    return {
      data: news,
      status: 200,
      message: 'News is fetched by ID',
    };
  }

  async updateNews(id: number, dto: UpdateNewsDto, file: any): Promise<object> {
    const news = await this.getOne(id);
    let updated_info: any;
    if (file) {
      await this.fileService.deleteFile(news.image);
      const image = await this.fileService.createFile(file);
      updated_info = await this.repository.update(
        { image, ...dto },
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
      message: 'News edited successfully',
    };
  }

  async deleteNews(id: number): Promise<object> {
    const news = await this.getOne(id);
    await this.fileService.deleteFile(news.image);
    await news.destroy();
    return {
      status: 200,
      message: 'News deleted successfully',
    };
  }

  async getOne(id: number): Promise<News> {
    const news = await this.repository.findByPk(id);
    if (!news) {
      throw new NotFoundException('News not found!');
    }
    return news;
  }
}

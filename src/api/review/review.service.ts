import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from 'src/core/model/review.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from '../file/file.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Languages } from 'src/common/database/Enums';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review) private readonly repository: typeof Review,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async createReview(dto: CreateReviewDto, file: any): Promise<object> {
    const image = await this.fileService.createFile(file);
    const review = await this.repository.create({ image, ...dto });
    return {
      data: review,
      status: 201,
      message: 'Review created successfully',
    };
  }

  async getAllReviews(req?: Request): Promise<object> {
    const lang = req?.headers?.lang;
    const cached_data = await this.cacheManager.get('reviews');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All reviews are fetched',
      };
    }
    let reviews: any;
    if (!lang) {
      reviews = await this.repository.findAll({
        order: [['createdAt', 'DESC']],
      });
    } else {
      reviews = await this.repository.findAll({
        where: { language: lang },
        order: [['createdAt', 'DESC']],
      });
    }
    await this.cacheManager.set('reviews', reviews, 60);
    return {
      data: reviews,
      status: 200,
      message: 'All reviews are fetched',
    };
  }

  async paginationReviews(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const reviews = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: reviews,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Reviews are fetched with pagination',
    };
  }

  async updateReview(
    id: number,
    dto: UpdateReviewDto,
    file: any,
  ): Promise<object> {
    const review = await this.getOne(id);
    let updated_info: any;
    if (file) {
      await this.fileService.deleteFile(review.image);
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
      message: 'Review edited successfully',
    };
  }

  async deleteReview(id: number): Promise<object> {
    const review = await this.getOne(id);
    await this.fileService.deleteFile(review.image);
    await review.destroy();
    return {
      status: 200,
      message: 'Review deleted successfully',
    };
  }

  async getOne(id: number): Promise<Review> {
    const review = await this.repository.findByPk(id);
    if (!review) {
      throw new NotFoundException('Review not found!');
    }
    return review;
  }
}

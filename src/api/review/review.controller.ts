import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipes/image-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';

@Controller('review')
@UseInterceptors(CacheInterceptor)
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createReview(
    @Body() dto: CreateReviewDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.createReview(dto, file);
  }

  @Get()
  async getAllReviews(@Req() req?: Request) {
    return this.service.getAllReviews(req);
  }

  @Get('/pagination')
  async paginationReviews(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationReviews(page, limit);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateReview(
    @Param('id') id: number,
    @Body() dto: UpdateReviewDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.updateReview(id, dto, file);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: number) {
    return this.service.deleteReview(id);
  }
}

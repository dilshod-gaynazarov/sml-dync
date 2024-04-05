import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from 'src/core/model/review.model';
import { FileModule } from '../file/file.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [SequelizeModule.forFeature([Review]), FileModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from 'src/core/model/news.model';
import { FileModule } from '../file/file.module';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [SequelizeModule.forFeature([News]), FileModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

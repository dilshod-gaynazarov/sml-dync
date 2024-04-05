import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from 'src/core/model/image.model';
import { FileModule } from '../file/file.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [SequelizeModule.forFeature([Image]), FileModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}

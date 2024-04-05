import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from 'src/core/model/document.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([Document]), FileModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}

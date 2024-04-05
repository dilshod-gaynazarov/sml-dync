import { Module } from '@nestjs/common';
import { GaleryService } from './galery.service';
import { GaleryController } from './galery.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Galery } from 'src/core/model/galery.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([Galery]), FileModule],
  controllers: [GaleryController],
  providers: [GaleryService],
})
export class GaleryModule {}

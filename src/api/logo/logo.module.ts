import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Logo } from 'src/core/model/logo.model';
import { FileModule } from '../file/file.module';
import { LogoController } from './logo.controller';
import { LogoService } from './logo.service';

@Module({
  imports: [SequelizeModule.forFeature([Logo]), FileModule],
  controllers: [LogoController],
  providers: [LogoService],
})
export class LogoModule {}

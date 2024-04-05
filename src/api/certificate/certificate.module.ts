import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Certificate } from 'src/core/model/certificate.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([Certificate]), FileModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}

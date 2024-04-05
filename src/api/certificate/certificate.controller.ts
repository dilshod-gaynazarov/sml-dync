import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/infrastructure/lib/pipes/file-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Controller('certificate')
@UseInterceptors(CacheInterceptor)
export class CertificateController {
  constructor(private readonly service: CertificateService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificate(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() dto: CreateCertificateDto,
  ) {
    return this.service.uploadCertificate(file, dto);
  }

  @Get()
  async getAllCertificates() {
    return this.service.getAllCertificates();
  }

  @Get('/pagination')
  async paginationCertificates(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationCertificates(page, limit);
  }

  @Get(':id')
  async getCertificateByID(@Param('id') id: number) {
    return this.service.getCertificateByID(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateCertificate(
    @Param('id') id: number,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() dto: UpdateCertificateDto,
  ) {
    return this.service.updateCertificate(id, file, dto);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteCertificate(@Param('id') id: number) {
    return this.service.deleteCertificate(id);
  }
}

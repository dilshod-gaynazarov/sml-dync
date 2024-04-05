import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogoService } from './logo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipes/image-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('logo')
@UseInterceptors(CacheInterceptor)
export class LogoController {
  constructor(private readonly service: LogoService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.uploadLogo(file);
  }

  @Get()
  async getAllLogos() {
    return this.service.getAllLogos();
  }

  @Get('/pagination')
  async paginationLogos(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationLogos(page, limit);
  }

  @Get(':id')
  async getLogoByID(@Param('id') id: number) {
    return this.service.getLogoByID(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteLogo(@Param('id') id: number) {
    return this.service.deleteLogo(id);
  }
}

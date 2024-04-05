import {
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
import { ImageService } from './image.service';
import { AdminGuard } from '../auth/guard/admin.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipes/image-validation.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('image')
@UseInterceptors(CacheInterceptor)
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.uploadImage(file);
  }

  @Get()
  async getAllImages() {
    return this.service.getAllImages();
  }

  @Get('/pagination')
  async paginationImages(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationImages(page, limit);
  }

  @Get(':id')
  async getImageByID(@Param('id') id: number) {
    return this.service.getImageByID(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('id') id: number,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.updateImage(id, file);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteImage(@Param('id') id: number) {
    return this.service.deleteImage(id);
  }
}

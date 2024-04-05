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
import { GaleryService } from './galery.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipes/image-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CreateGaleryDto } from './dto/create-galery.dto';
import { UpdateGaleryDto } from './dto/update-galery.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('galery')
@UseInterceptors(CacheInterceptor)
export class GaleryController {
  constructor(private readonly service: GaleryService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createReview(
    @Body() dto: CreateGaleryDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.createGalery(dto, file);
  }

  @Get()
  async getAllGaleries() {
    return this.service.getAllGaleries();
  }

  @Get('/pagination')
  async paginationGaleries(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationGaleries(page, limit);
  }

  @Get(':id')
  async getGaleryByID(@Param('id') id: number) {
    return this.service.getGaleryByID(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateGalery(
    @Param('id') id: number,
    @Body() dto: UpdateGaleryDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.updateGalery(id, dto, file);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteGalery(@Param('id') id: number) {
    return this.service.deleteGalery(id);
  }
}

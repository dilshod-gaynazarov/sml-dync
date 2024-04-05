import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AdminGuard } from '../auth/guard/admin.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewsDto } from './dto/create-news.dto';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipes/image-validation.pipe';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';

@Controller('news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createNews(
    @Body() dto: CreateNewsDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.createNews(dto, file);
  }

  @Get()
  async getAllNews(@Req() req?: Request) {
    return this.service.getAllNews(req);
  }

  @Get('/pagination')
  async paginationNews(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationNews(page, limit);
  }

  @Get(':id')
  async getNewsByID(@Param('id') id: number, @Req() req?: Request) {
    return this.service.getNewsByID(id, req);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateNews(
    @Param('id') id: number,
    @Body() dto: UpdateNewsDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.service.updateNews(id, dto, file);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteNews(@Param('id') id: number) {
    return this.service.deleteNews(id);
  }
}

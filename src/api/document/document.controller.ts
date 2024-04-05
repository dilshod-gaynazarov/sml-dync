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
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/infrastructure/lib/pipes/file-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
@UseInterceptors(CacheInterceptor)
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.service.uploadDocument(file, dto);
  }

  @Get()
  async getAllDocuments() {
    return this.service.getAllDocuments();
  }

  @Get('/pagination')
  async paginationDocuments(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationDocuments(page, limit);
  }

  @Get(':id')
  async getDocumentByID(@Param('id') id: number) {
    return this.service.getDocumentByID(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateDocument(
    @Param('id') id: number,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.service.updateDocument(id, file, dto);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return this.service.deleteDocument(id);
  }
}

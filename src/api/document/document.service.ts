import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from 'src/core/model/document.model';
import { FileService } from '../file/file.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document) private readonly repository: typeof Document,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async uploadDocument(file: any, dto: CreateDocumentDto): Promise<object> {
    const uploaded_file = await this.fileService.createFile(file);
    const document = await this.repository.create({
      document: uploaded_file,
      ...dto,
    });
    return {
      data: document,
      status: 201,
      message: 'Document uploaded successfully',
    };
  }

  async getAllDocuments(): Promise<object> {
    const cached_data = await this.cacheManager.get('documents');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All documents are fetched',
      };
    }
    const documents: any = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('documents', documents, 60);
    return {
      data: documents,
      status: 200,
      message: 'All documents are fetched',
    };
  }

  async paginationDocuments(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const documents = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: documents,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Documents are fetched with pagination',
    };
  }

  async getDocumentByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('document');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Document is fetched by ID',
      };
    }
    const document = await this.getOne(id);
    await this.cacheManager.set('document', document, 60);
    return {
      data: document,
      status: 200,
      message: 'Document is fetched by ID',
    };
  }

  async updateDocument(
    id: number,
    file: any,
    dto: UpdateDocumentDto,
  ): Promise<object> {
    const document = await this.getOne(id);
    let updated_info: any;
    if (file) {
      await this.fileService.deleteFile(document.document);
      const uploaded_file = await this.fileService.createFile(file);
      updated_info = await this.repository.update(
        { document: uploaded_file, ...dto },
        { where: { id }, returning: true },
      );
    } else {
      updated_info = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });
    }
    return {
      data: updated_info[1][0],
      status: 200,
      message: 'Document edited successfully',
    };
  }

  async deleteDocument(id: number): Promise<object> {
    const document = await this.getOne(id);
    await this.fileService.deleteFile(document.document);
    await document.destroy();
    return {
      status: 200,
      message: 'Document deleted successfully',
    };
  }

  async getOne(id: number): Promise<Document> {
    const document = await this.repository.findByPk(id);
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    return document;
  }
}

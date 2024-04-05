import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Certificate } from 'src/core/model/certificate.model';
import { FileService } from '../file/file.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate) private readonly repository: typeof Certificate,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileService: FileService,
  ) {}

  async uploadCertificate(
    file: any,
    dto: CreateCertificateDto,
  ): Promise<object> {
    const uploaded_file = await this.fileService.createFile(file);
    const certificate = await this.repository.create({
      certificate: uploaded_file,
      ...dto,
    });
    return {
      data: certificate,
      status: 201,
      message: 'Certificate uploaded successfully',
    };
  }

  async getAllCertificates(): Promise<object> {
    const cached_data = await this.cacheManager.get('certificates');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All certificates are fetched',
      };
    }
    const certificates: any = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('certificates', certificates, 60);
    return {
      data: certificates,
      status: 200,
      message: 'All certificates are fetched',
    };
  }

  async paginationCertificates(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const certificates = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: certificates,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Certificates are fetched with pagination',
    };
  }

  async getCertificateByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('certificate');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Certificate is fetched by ID',
      };
    }
    const certificate = await this.getOne(id);
    await this.cacheManager.set('certificate', certificate, 60);
    return {
      data: certificate,
      status: 200,
      message: 'Certificate is fetched by ID',
    };
  }

  async updateCertificate(
    id: number,
    file: any,
    dto: UpdateCertificateDto,
  ): Promise<object> {
    const certificate = await this.getOne(id);
    let updated_info: any;
    if (file) {
      await this.fileService.deleteFile(certificate.certificate);
      const uploaded_file = await this.fileService.createFile(file);
      updated_info = await this.repository.update(
        { certificate: uploaded_file, ...dto },
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
      message: 'Certificate edited successfully',
    };
  }

  async deleteCertificate(id: number): Promise<object> {
    const certificate = await this.getOne(id);
    await this.fileService.deleteFile(certificate.certificate);
    await certificate.destroy();
    return {
      status: 200,
      message: 'Certificate deleted successfully',
    };
  }

  async getOne(id: number): Promise<Certificate> {
    const certificate = await this.repository.findByPk(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found!');
    }
    return certificate;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Vacancy } from 'src/core/model/vacancy.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy) private readonly repository: typeof Vacancy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createVacancy(createVacancyDto: CreateVacancyDto): Promise<object> {
    const vacancy = await this.repository.create({ ...createVacancyDto });
    return {
      data: vacancy,
      status: 201,
      message: 'Vacancy created successfully',
    };
  }

  async getAllVacancies(): Promise<object> {
    const cached_data = await this.cacheManager.get('vacancies');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All vacancies are fetched',
      };
    }
    const vacancies = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('vacancies', vacancies);
    return {
      data: vacancies,
      status: 200,
      message: 'All vacancies are fetched',
    };
  }

  async paginationVacancies(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const vacancies = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: vacancies,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Vacancies are fetched with pagination',
    };
  }

  async getVacancyById(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('vacancy');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Vacancy fetched by ID',
      };
    }
    const vacancy = await this.getOne(id);
    await this.cacheManager.set('vacancy', vacancy, 60);
    return {
      data: vacancy,
      status: 200,
      message: 'Vacancy fetched by ID',
    };
  }

  async updateVacancy(
    id: number,
    updateVacancyDto: UpdateVacancyDto,
  ): Promise<object> {
    await this.getOne(id);
    const updated_info = await this.repository.update(updateVacancyDto, {
      where: { id },
      returning: true,
    });
    return {
      data: updated_info[1][0],
      status: 200,
      message: 'Vacancy edited successfully',
    };
  }

  async deleteVacancy(id: number): Promise<object> {
    const vacancy = await this.getOne(id);
    await vacancy.destroy();
    return {
      status: 200,
      message: 'Vacancy deleted successfully',
    };
  }

  async getOne(id: number): Promise<Vacancy> {
    const vacancy = await this.repository.findByPk(id);
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found!');
    }
    return vacancy;
  }
}

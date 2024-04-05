import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vacancy } from 'src/core/model/vacancy.model';

@Module({
  imports: [SequelizeModule.forFeature([Vacancy])],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}

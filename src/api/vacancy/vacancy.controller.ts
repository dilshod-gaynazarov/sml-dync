import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { AdminGuard } from '../auth/guard/admin.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly service: VacancyService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.service.createVacancy(createVacancyDto);
  }

  @Get()
  async getAllVacancies() {
    return this.service.getAllVacancies();
  }

  @Get('/pagination')
  async paginationVacancies(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationVacancies(page, limit);
  }

  @Get(':id')
  async getVacancyById(@Param('id') id: number) {
    return this.service.getVacancyById(id);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateVacancy(
    @Param('id') id: number,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.service.updateVacancy(id, updateVacancyDto);
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteVacancy(@Param('id') id: number) {
    return this.service.deleteVacancy(id);
  }
}

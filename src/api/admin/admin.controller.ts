import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Request } from 'express';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { SuperAdminGuard } from '../auth/guard/super-admin.guard';
import { SelfOrAdminGuard } from '../auth/guard/admin-self.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('admin')
@UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('superadmin')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.service.createAdmin(dto);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Post('add')
  async createManager(@Body() dto: CreateAdminDto) {
    return this.service.createManager(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.service.login(dto);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Get()
  async getAllAdmins() {
    return this.service.getAllAdmins();
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Get('/pagination')
  async paginationAdmins(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationAdmins(page, limit);
  }

  @UseGuards(SelfOrAdminGuard)
  @UseGuards(JwtGuard)
  @Get(':id')
  async getAdminByID(@Param('id') id: number) {
    return this.service.getAdminByID(id);
  }

  @UseGuards(SelfOrAdminGuard)
  @UseGuards(JwtGuard)
  @Patch('profile/:id')
  async updateProfile(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.service.updateProfile(id, req, dto);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: number, @Req() req: Request) {
    return this.service.deleteAdmin(id, req);
  }
}

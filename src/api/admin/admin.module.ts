import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from 'src/core/model/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin]),
    JwtModule.register({ global: true }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

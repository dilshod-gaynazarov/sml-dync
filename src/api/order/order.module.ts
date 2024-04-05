import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/core/model/order.model';
import { FileModule } from '../file/file.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [SequelizeModule.forFeature([Order]), FileModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

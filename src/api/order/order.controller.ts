import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOrderDto } from './dto/create-order.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('order')
@UseInterceptors(CacheInterceptor)
export class OrderController {
  constructor(private readonly service: OrderService) {}
  @Post()
  @UseInterceptors(FilesInterceptor('file', 30))
  async createOrder(
    @Body() dto: CreateOrderDto,
    @UploadedFiles() file?: Array<Express.Multer.File>,
  ) {
    return this.service.createOrder(dto, file);
  }

  @Get()
  async getAllOrders() {
    return this.service.getAllOrders();
  }

  @Get('/pagination')
  async paginationOrders(
    @Query('page') page: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.paginationOrders(page, limit);
  }

  @Get(':id')
  async getOrderByID(@Param('id') id: number) {
    return this.service.getOrderByID(id);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return this.service.deleteOrder(id);
  }
}

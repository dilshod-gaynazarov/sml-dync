import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/core/model/order.model';
import { FileService } from '../file/file.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { Cache } from 'cache-manager';
import { config } from 'src/config';
import products from './json/index.json';
import { basename, resolve } from 'path';
import { createReadStream, readFileSync } from 'fs';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private readonly repository: typeof Order,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectBot() private bot: Telegraf<Context>,
    private readonly fileService: FileService,
  ) {}

  async createOrder(dto: CreateOrderDto, file?: any): Promise<object> {
    let order: any;
    let uploaded_files: string[] = [];
    if (file) {
      file.map(async (f: any) => {
        const uploaded = await this.fileService.createFile(f);
        uploaded_files.push(uploaded);
      });
      order = await this.repository.create({ file: uploaded_files, ...dto });
    } else {
      order = await this.repository.create({ ...dto });
    }
    let order_details = `\n\n<b>Название компании:</b> ${dto.enterprises}\n`;
    order_details += `<b>Имя:</b> ${dto.name}\n`;
    order_details += `<b>Телефон:</b> ${dto.phone}\n`;
    order_details += `<b>Email:</b> ${dto.email}\n`;
    const product_title = products[dto.product_title];
    if (product_title) {
      order_details += `<b>Товар:</b> ${product_title}\n\n`;
    } else {
      order_details += `<b>Товар:</b> Неизвестный товар\n\n`;
    }
    // let ru = {
    //   packedProduct: 'Затариваемый продукт',
    //   bulkDensity: 'Насыпная плотность',
    //   productWeightKg: 'Масса продукта (кг)',
    //   bagWeightKg: 'Вес мешка (кг)',
    //   deliveryVolume: 'Объём поставки',
    //   bagISm: 'I (см)',
    //   bagbSm: 'B (см)',
    //   bagASm: 'a (см)',
    //   isNeedType: 'Нужна печать на мешке',
    //   isPeVkladish: 'ПЭ вкладыш',
    //   isLamination: 'Ламинация',
    //   bagLSm: 'L (см)',
    //   sleeve: 'Рукав',
    //   semiSleeve: 'Полурукав',
    //   cloth: 'Полотно',
    //   fabricWidth: 'Ширина ткани',
    //   fabricDensityGM2: 'Плотность (г/м2)',
    //   fabricStructure: 'Структура ткани',
    //   withFalts: 'Со скидкой',
    //   bagDensity: 'Плотность мешка',
    //   bagLengthSm: 'Длина сумки (см)',
    //   bagHeightSm: 'Высота сумки (см)',
    //   additionalInfo: 'Дополнительная информация',
    // };
    await this.bot.telegram.sendMessage(config.GROUP_CHAT_ID, order_details, {
      parse_mode: 'HTML',
    });
    if (file && uploaded_files.length) {
      for (let i of uploaded_files) {
        const file_path = resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'uploads',
          i,
        );
        const read = readFileSync(file_path);
        await this.bot.telegram.sendDocument(config.GROUP_CHAT_ID, {
          source: read,
          filename: basename(i),
        });
      }
    }
    return {
      data: order,
      status: 201,
      message: 'Order created successfully',
    };
  }

  async getAllOrders(): Promise<object> {
    const cached_data = await this.cacheManager.get('orders');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All orders are fetched',
      };
    }
    const orders = await this.repository.findAll({
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('orders', orders, 60);
    return {
      data: orders,
      status: 200,
      message: 'All orders are fetched',
    };
  }

  async paginationOrders(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const orders = await this.repository.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: orders,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Orders are fetched with pagination',
    };
  }

  async getOrderByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('order');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Order is fetched by ID',
      };
    }
    const order = await this.getOne(id);
    await this.cacheManager.set('order', order, 60);
    return {
      data: order,
      status: 200,
      message: 'Order is fetched by ID',
    };
  }

  async deleteOrder(id: number): Promise<object> {
    const order = await this.getOne(id);
    if (order?.file) {
      order.file.map(async (f: any) => {
        await this.fileService.deleteFile(f);
      });
    }
    await order.destroy();
    return {
      status: 200,
      message: 'Order deleted successfully',
    };
  }

  async getOne(id: number): Promise<Order> {
    const order = await this.repository.findByPk(id);
    if (!order) {
      throw new NotFoundException('Order not found!');
    }
    return order;
  }
}

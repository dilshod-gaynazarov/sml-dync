import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { LogoModule } from './logo/logo.module';
import { ReviewModule } from './review/review.module';
import { NewsModule } from './news/news.module';
import { ImageModule } from './image/image.module';
import { OrderModule } from './order/order.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { config } from 'src/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { VacancyModule } from './vacancy/vacancy.module';
import { DocumentModule } from './document/document.module';
import { CertificateModule } from './certificate/certificate.module';
import { GaleryModule } from './galery/galery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: config.PG_HOST,
      port: config.PG_PORT,
      username: config.PG_USER,
      password: config.PG_PASS,
      database: config.PG_DB,
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'uploads'),
    }),
    TelegrafModule.forRoot({
      token: config.BOT_TOKEN,
    }),
    CacheModule.register({
      isGlobal: true,
      max: 1000,
    }),
    FileModule,
    AdminModule,
    LogoModule,
    ReviewModule,
    NewsModule,
    ImageModule,
    OrderModule,
    VacancyModule,
    DocumentModule,
    CertificateModule,
    GaleryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}

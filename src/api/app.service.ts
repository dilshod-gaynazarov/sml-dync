import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { logger } from 'src/infrastructure/lib/logger';

export default class App {
  public static async main(): Promise<void> {
    try {
      const app = await NestFactory.create(AppModule);
      app.enableCors({ origin: '*' });
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
      );
      await app.listen(config.PORT, () => {
        logger.info(`${config.PORT} port run success`);
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}

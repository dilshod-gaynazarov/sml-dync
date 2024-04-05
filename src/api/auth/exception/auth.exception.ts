import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class Unauthorized extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'authorization_error')), 400);
  }
}

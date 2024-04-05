import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class Forbidden extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'forbidden')), 403);
  }
}

import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class AlreadyExistEmail extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'already_exist_email')), 409);
  }
}

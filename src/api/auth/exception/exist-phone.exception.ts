import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class AlreadyExistPhone extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'already_exist_phone')), 409);
  }
}

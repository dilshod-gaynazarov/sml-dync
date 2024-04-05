import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ErrorFileValidation extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'file_validation')), 403);
  }
}

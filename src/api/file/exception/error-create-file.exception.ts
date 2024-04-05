import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ErrorCreatingFile extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'error_create_file')), 500);
  }
}

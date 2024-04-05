import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ErrorDeletingFile extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'error_delete_file')), 500);
  }
}

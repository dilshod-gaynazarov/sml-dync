import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ErrorImageValidation extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'image_validation')), 403);
  }
}

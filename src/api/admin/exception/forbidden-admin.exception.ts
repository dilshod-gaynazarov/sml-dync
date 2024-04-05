import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ForbiddenAdmin extends HttpException {
  constructor() {
    super(JSON.stringify(getPrompt('application', 'forbidden_admin')), 403);
  }
}

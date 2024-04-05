import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class AdminNotFoundById extends HttpException {
  constructor() {
    super(
      JSON.stringify(getPrompt('application', 'admin_not_found_by_id')),
      404,
    );
  }
}

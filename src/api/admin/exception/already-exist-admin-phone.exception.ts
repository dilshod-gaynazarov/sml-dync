import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class AlreadyExistAdminPhone extends HttpException {
  constructor() {
    super(
      JSON.stringify(getPrompt('application', 'already_exist_admin_phone')),
      403,
    );
  }
}

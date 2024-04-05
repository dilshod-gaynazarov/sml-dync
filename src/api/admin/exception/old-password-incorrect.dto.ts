import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class OldPasswordIncorrect extends HttpException {
  constructor() {
    super(
      JSON.stringify(getPrompt('application', 'old_password_incorrect')),
      400,
    );
  }
}

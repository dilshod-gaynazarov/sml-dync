import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class LoginOrPasswordIncorrect extends HttpException {
  constructor() {
    super(
      JSON.stringify(getPrompt('application', 'login_or_password_incorrect')),
      400,
    );
  }
}

import { HttpException } from '@nestjs/common';
import { getPrompt } from 'src/infrastructure/lib/prompts/errorPrompt';

export class ConfirmNewPasswordIncorrect extends HttpException {
  constructor() {
    super(
      JSON.stringify(
        getPrompt('application', 'confirm_new_password_incorrect'),
      ),
      400,
    );
  }
}

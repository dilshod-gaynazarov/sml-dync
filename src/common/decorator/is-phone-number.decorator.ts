import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ async: true })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone_number: any, args: ValidationArguments) {
    const phone = parsePhoneNumberFromString(phone_number);
    return phone ? phone.isValid() : false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid phone number!';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { IsPhoneNumber } from 'src/common/decorator/is-phone-number.decorator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  enterprises: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  requirements?: any;

  @IsNotEmpty()
  @IsString()
  product_title: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  experience: number;

  @IsOptional()
  day: number;

  @IsOptional()
  start_hour: string;

  @IsOptional()
  end_hour: string;

  @IsOptional()
  salary: number;

  @IsNotEmpty()
  @IsString()
  info: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  hr_phone: string;

  @IsNotEmpty()
  @IsEmail()
  hr_email: string;
}

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Languages } from 'src/common/database/Enums';

export class CreateNewsDto {
  @IsNotEmpty()
  start_date: number;

  @IsOptional()
  end_date: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsEnum(Languages)
  lang: Languages;
}

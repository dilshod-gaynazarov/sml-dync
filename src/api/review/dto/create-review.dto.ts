import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Languages } from 'src/common/database/Enums';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  info: string;

  @IsNotEmpty()
  stars: number;

  @IsNotEmpty()
  @IsEnum(Languages)
  language: Languages;
}

import { IsOptional } from 'class-validator';

export class CreateGaleryDto {
  @IsOptional()
  title: string;
}

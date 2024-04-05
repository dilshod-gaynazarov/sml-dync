import { PartialType } from '@nestjs/mapped-types';
import { CreateGaleryDto } from './create-galery.dto';

export class UpdateGaleryDto extends PartialType(CreateGaleryDto) {}

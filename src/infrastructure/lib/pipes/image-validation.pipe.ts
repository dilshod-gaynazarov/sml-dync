import { PipeTransform, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { ErrorImageValidation } from 'src/api/file/exception/image-validation.exception';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.webp',
    '.gif',
    '.bmp',
    '.tiff',
    '.tif',
    '.dib',
    '.heif',
    '.heic',
    '.cr2',
    '.nef',
    '.arw',
    '.dng',
  ];
  transform(value: any) {
    if (value) {
      const file = value?.originalname;
      const fileExtension = extname(file).toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        throw new ErrorImageValidation();
      }
      return value;
    }
  }
}

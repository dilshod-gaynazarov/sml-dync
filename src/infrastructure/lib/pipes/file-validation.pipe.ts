import { PipeTransform, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { ErrorFileValidation } from 'src/api/file/exception/file-validation.exception';
import { ErrorImageValidation } from 'src/api/file/exception/image-validation.exception';

@Injectable()
export class FileValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = [
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.xls',
    '.xlsx',
    '.xlsm',
    '.xlsb',
    '.xltx',
    '.xltm',
    '.rtf',
    '.odt',
  ];
  transform(value: any) {
    if (value) {
      const file = value?.originalname;
      const fileExtension = extname(file).toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        throw new ErrorFileValidation();
      }
      return value;
    }
  }
}

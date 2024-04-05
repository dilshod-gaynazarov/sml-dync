import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { resolve, join, extname } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { ErrorCreatingFile } from './exception/error-create-file.exception';
import { ErrorDeletingFile } from './exception/error-delete-file.exception';

@Injectable()
export class FileService {
  async createFile(file: any): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const file_name = v4() + ext;
      const file_path = resolve(__dirname, '..', '..', '..', '..', 'uploads');
      if (!existsSync(file_path)) {
        mkdirSync(file_path, { recursive: true });
      }
      writeFileSync(join(file_path, file_name), file.buffer);
      return file_name;
    } catch (error) {
      throw new ErrorCreatingFile();
    }
  }

  async deleteFile(file_name: string) {
    try {
      unlinkSync(
        resolve(__dirname, '..', '..', '..', '..', 'uploads', file_name),
      );
    } catch (error) {
      throw new ErrorDeletingFile();
    }
  }
}

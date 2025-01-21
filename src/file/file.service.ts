import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private readonly uploadDir = join(process.cwd(), 'uploads');
  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir);
    }
  }
  saveFile(file: Express.Multer.File) {
    const filePath = join(this.uploadDir, `${Date.now()}${file.originalname}`);
    const fileUrl = `/uploads/${Date.now()}${file.originalname}`;
    const fs = require('fs');
    fs.writeFileSync(filePath, file.buffer);
    return fileUrl;
  }
}

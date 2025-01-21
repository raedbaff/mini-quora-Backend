import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';

@Global()
@Module({
  exports: [FileService],
  providers: [FileService],
})
export class FileModule {}

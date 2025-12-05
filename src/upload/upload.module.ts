import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { OcrService } from 'src/processing/ocr.service';
import { HttpModule } from '@nestjs/axios';
import { ProcessingModule } from 'src/processing/processing.module';

@Module({
  imports: [HttpModule, ProcessingModule],
  controllers: [UploadController],
  providers: [OcrService]
  
})
export class UploadModule {}

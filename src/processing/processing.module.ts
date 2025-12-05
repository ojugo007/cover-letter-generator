import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { HttpModule } from '@nestjs/axios';
import { ProcessingService } from './processing.service';
import { UsersModule } from 'src/users/users.module';
import { AiModule } from 'src/ai/ai.module';
import { AiService } from 'src/ai/ai.service';

@Module({
  imports : [HttpModule, UsersModule, AiModule],
  providers: [OcrService, ProcessingService],
  exports: [OcrService, ProcessingService]
})
export class ProcessingModule {}

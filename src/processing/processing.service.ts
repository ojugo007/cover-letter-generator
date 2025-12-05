import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { UsersService } from 'src/users/users.service';
import { OcrService } from './ocr.service';

@Injectable()
export class ProcessingService {
    constructor(
        private readonly usersService:UsersService,
        private readonly aiService:AiService,
        private readonly ocrService:OcrService,
    ){}

    async handleCoverLetterGeneration(userId:string, file:Express.Multer.File){
        const extractText =  await this.ocrService.extractText(file);

        const user = await this.usersService.findById(userId);

        const coverLetter = await this.aiService.generateCoverLetter({
            userData : user, 
            jobDescription : extractText
        })

        return{
            coverLetter
        }
    }
}

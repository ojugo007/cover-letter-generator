import { BadRequestException, Body, Controller, FileTypeValidator, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { OcrService } from 'src/processing/ocr.service';
import { ProcessingService } from 'src/processing/processing.service';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';


@ApiTags('Upload & Cover Letter')
@Controller('upload')
export class UploadController {
    constructor(
        // private readonly ocrService: OcrService,
        private readonly processingService: ProcessingService,

    ) { }

    @Post("")
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload a Job Description Screenshot /image',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required:['file']
        },
    })
    async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Only image files are allowed');
        }
        const userId = req.user.id
        return await this.processingService.handleCoverLetterGeneration(userId, file);
    }

}

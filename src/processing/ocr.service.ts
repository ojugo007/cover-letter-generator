import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData = require('form-data');
import { textCleanup } from 'src/utils/textCleanup.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OcrService {
    private readonly apiKey: string;

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('ocr.apiKey', { infer: true })!;
        if (!this.apiKey) {
            throw new Error('OCR API key is missing.');
        }
    }

  async extractText(file: Express.Multer.File) {
    const form = new FormData();
    form.append('apikey', this.apiKey);
    form.append('file', file.buffer, file.originalname); 

    const { data } = await this.http.axiosRef.post(
      'https://api.ocr.space/parse/image',
      form,
      { headers: form.getHeaders() },
    );

    const text = data?.ParsedResults?.[0]?.ParsedText ?? '';
    console.log(textCleanup(text))
    console.log("testing if text was extracted : ", text)
    console.log("extract text ran ")
    return textCleanup(text);
  }
}

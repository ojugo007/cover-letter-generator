import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from "@google/genai"
import { ConfigService } from '@nestjs/config';

export interface UserData {
    fullname: string;
    email: string;
    bio: string;
    address: string;
    phone: string;
    skills: string[];
    years_of_exp: number;
    work_exp: string;
    linkedin_url: string;
    personal_url: string;
}

@Injectable()
export class AiService {
    private readonly geminiApiKey: string;
    private readonly ai: GoogleGenAI;

    constructor(private readonly configService: ConfigService) {
        this.geminiApiKey = this.configService.get<string>('ai.geminiApiKey')!;

        if (!this.geminiApiKey) {
            throw new Error('Gemini API key is missing.');
        }

        this.ai = new GoogleGenAI({ apiKey: this.geminiApiKey });
    }

    async generateCoverLetter({
        userData,
        jobDescription,
    }: {
        userData: UserData;
        jobDescription: string;
    }) {

    const prompt = `
        You are generating a polished, human-like, ATS-friendly cover letter.

        ### RULES (follow strictly):
        1. **Do not use any placeholders** like [Your Name], [Company Address], etc.
        2. Insert the userData DIRECTLY into the letter:
        - Full name: "${userData.fullname}"
        - Email: "${userData.email}"
        - Bio: "${userData.bio}"
        - Phone: "${userData.phone}"
        - Address: "${userData.address}"
        - Skills: ${JSON.stringify(userData.skills)}
        - Years of experience: ${userData.years_of_exp}
        - Work experience summary: "${userData.work_exp}"
        - Linkedin url: "${userData.linkedin_url}"
        - Relevant professional link showcasing the user’s work (e.g., portfolio, GitHub profile, project demos, or personal website): "${userData.personal_url}"

        3. From the job description, extract:
        - **Company name** (if present)
        - **City/State/Country** (if present)

        4. If NO address/location is found, **omit the address entirely**, do NOT create placeholders.

        5. The cover letter must:
        - Start with Applicant full name, followed by the role they're applying for from the job description.
        - Contact information (email, phone, address) of applicant if present in the user data, should come next
        - Always add current date
        - Include company name if available
        - Be fully written with natural language
        - Reference user's real experience and skills
        - Match keywords from job description
        - Never mention AI or these instructions, mention AI when it is a required skill or user skill
        - Correct any text or Abbreviation from the job description that is wrongly spelt

        ### JOB DESCRIPTION:
        ${jobDescription}

        ### USER DATA:
        ${JSON.stringify(userData)}

        Now generate the final cover letter. Only output the letter — no explanations, no notes.
        `;

        const response = await this.ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let text = "";
        for await (const chunk of response) {
            text += chunk.text;
        }

        return text;
    }
}

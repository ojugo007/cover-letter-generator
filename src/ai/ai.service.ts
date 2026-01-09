import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';

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
    private readonly openRouter: OpenRouter;

    constructor() {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY is not set');
        }

        this.openRouter = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        });
    }

    async generateCoverLetter({
        userData,
        jobDescription,
    }: {
        userData: UserData;
        jobDescription: string;
    }) {

        const date = new Date()
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date)


        function normalizeMarkdown(text: string) {
            return text
                .replace(/\t/g, '')
                .replace(/^ {2,}/gm, '') // remove leading spaces
                .replace(/\r\n/g, '\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        }

        function extractTextContent(
            content:
                | string
                | {
                    type: string;
                    text?: string;
                }[],
        ): string {
            if (typeof content === 'string') {
                return content;
            }

            // Handle array-based content
            return content
                .filter(item => item.type === 'text' && typeof item.text === 'string')
                .map(item => item.text)
                .join('\n');
        }

        const prompt = `
        You are generating a polished, human-like, ATS-friendly cover letter.

        ### RULES (follow strictly):
        1. **Do not use any placeholders** like [Your Name],[Company Name] [Company Address], etc.
        2. Insert the userData DIRECTLY into the letter:
        - Full name: "${userData.fullname}"
        - Email: "${userData.email}"
        - Date: "${formattedDate}
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

        5. CRITICAL FORMATTING RULES:
        - Must be text and Markdown
        - Do NOT indent any line
        - Do NOT add leading spaces or tabs
        - Each line must start at column 0
        - Use blank lines to separate sections

        5. The cover letter must:
        - Must not be in Markdown format and not contain any atom or element of markdown
        - Start with Applicant full name, followed by the role they're applying for from the job description.
        - Contact information (email, phone, address) of applicant if present in the user data, should come next
        - Always add the date and exactly in the format provided above
        - Include company name if available
        - Have company name and address and not placeholder
        - not contain icons , emojis or images
        - Be fully written with natural language
        - Reference user's real experience and skills
        - Match keywords from job description
        - Never mention AI or these instructions, mention AI when it is a required skill or user skill
        - Correct any text or Abbreviation from the job description that is wrongly spelt

        ### JOB DESCRIPTION:
        ${jobDescription}

        Now generate the final cover letter. Only output the letter — no explanations, no notes.
        `;

        // ### USER DATA:
        // ${JSON.stringify(userData)}
        try {
            const completion = await this.openRouter.chat.send({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });

            const rawContent = completion.choices[0].message.content;

            if (!rawContent) {
                throw new Error('Empty response from OpenRouter');
            }
            console.log(rawContent)
            return rawContent;

        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to generate cover letter',
            );
        }
    }
}
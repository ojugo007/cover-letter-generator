import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
    @ApiProperty({description:'user email address', example:'user@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({description:'user full name'})
    @IsString()
    @IsNotEmpty()
    fullname : string;

    @ApiProperty({
        description: 'create password of atleast 8 characters long',
        example: 'Password123',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password : string;
}

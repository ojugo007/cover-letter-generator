import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';


export class LoginDto{
    @ApiProperty({
        description:'user email address',  
        example: 'user@example.com'
    })
    @IsEmail()
    email : string;

    @ApiProperty({
        description: 'Account password',
        example: 'Password123',
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password : string
}
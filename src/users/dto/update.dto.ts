import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User Technical Skills' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'User years of experience' })
  @IsOptional()
  @IsInt()
  years_of_exp?: number;

  @ApiPropertyOptional({ description: 'Summary of User Work experience' })
  @IsOptional()
  @IsString()
  @MaxLength(350)
  work_exp?: string;

  @ApiPropertyOptional({ description: 'User bio' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ description: 'User Address [City, State]' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  address?: string;

  @ApiPropertyOptional({ description: 'User Phone [eg: +234 xxx-xxx-xxxx]' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'User LinkedIn profile URL',
    example: 'https://www.linkedin.com/in/johndoe'
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  linkedin_url?: string

  @ApiPropertyOptional({
    description: 'User personal website URL',
    example: 'https://johndoe.dev'
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  personal_url?: string
}

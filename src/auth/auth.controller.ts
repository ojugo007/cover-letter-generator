import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly usersService:UsersService,
        private readonly authService:AuthService
    ){}

  @Post('signup')
  createUser(@Body() signupDto : SignupDto){
    if(!signupDto){
        throw new BadRequestException("fields are required")
    }
    return this.authService.createUser(signupDto)

  }

  @Post('login')
  loginUser(@Body() loginDto:LoginDto){
    if(!loginDto){
      throw new BadRequestException('All fields required')
    }
    return this.authService.loginUser(loginDto)
  }
}

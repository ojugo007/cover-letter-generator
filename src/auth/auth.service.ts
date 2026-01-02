import {BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
    constructor( 
        private readonly usersService : UsersService,
        private readonly jwtService : JwtService
    ){}

    async createUser(signupDto : SignupDto){
      const user = await this.usersService.createUser(signupDto)
      const token = this.jwtService.sign({id: user.id, email:user.email, fullname:user.fullname, profileCompleted: user.profileCompleted})
       return {
        message : "Account successfully created",
            data :{ 
                email : user.email,
                fullname : user.fullname
            },
            token: token
       }
    }

    async loginUser (loginDto:LoginDto){
        const user = await this.usersService.getUserByEmailOrFail(loginDto.email);
        if(!user){
            throw new NotFoundException('no user found with the provided email')
        }

        const isValidPassword =await bcrypt.compare(loginDto.password, user.password)

        if(!isValidPassword){
            throw new BadRequestException("password don't match")
        }

        const token = this.jwtService.sign({email:user.email, id:user.id, fullname:user.fullname, profileCompleted: user.profileCompleted})

        return {
            message : "login successfully",
            data :{
                fullname : user.fullname,
                email: user.email
            },
            token
        }
    }
}

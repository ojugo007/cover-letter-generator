import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
    constructor(private readonly usersService:UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async findById(@Req() req){
        const userId = req.user.id
        console.log("is user: ", req.user)
        return await this.usersService.findById(req.user?.id)
    }

    @Get(':email')
    findByEmail(@Param('email') email:string){
        return this.usersService.findByEmail(email)
    }


    @Post()
    createUser(@Body() signupDto:SignupDto){
        return this.usersService.createUser(signupDto)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update authenticated user profile' })
    @ApiResponse({
        status: 200,
        description: 'Updated user profile',
        type: UpdateUserDto, 
    })
    UpdateProfile(@Req() req, @Body() updateUserDto : UpdateUserDto){
        const userId = req.user.id
        return this.usersService.UpdateProfile(userId, updateUserDto )
    }
}

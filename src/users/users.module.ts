import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports : [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
        JwtModule.registerAsync({
          imports:[ConfigModule],
          inject:[ConfigService],
          useFactory: async(config:ConfigService)=>({
            secret: config.get<string>('jwt.secret'),
            signOptions:{
              expiresIn:config.get('jwt.expiresIn')
            }
          })
        })
],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService]
})
export class UsersModule {}

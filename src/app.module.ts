import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/models/user.entity';
import { UploadModule } from './upload/upload.module';
import { ProcessingModule } from './processing/processing.module';
import { AiModule } from './ai/ai.module';
import databaseConfig from './configuration/database.config';
import jwtConfig from './configuration/jwt.config';
import ocrConfig from './configuration/ocr.config';
import aiConfig from './configuration/ai.config';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        jwtConfig,
        ocrConfig,
        aiConfig
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
       
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entity: [UserEntity],
          synchronize: true,
          keepConnectionAlive: true,
          autoLoadEntities: true,
          logging: true,
          ssl: { ca: fs.readFileSync('certs/aiven-ca.pem').toString(), }

        }
      }
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    ProcessingModule,
    AiModule,
  ],
  providers: [],

})

export class AppModule { }
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';

import { APP_WINSTON_CONFIG } from './common/logger/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ApplicationsModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DB_URL}/ig-token-refresher`),
    WinstonModule.forRoot(APP_WINSTON_CONFIG),
  ],
  controllers: [AppController],
})
export class AppModule {}

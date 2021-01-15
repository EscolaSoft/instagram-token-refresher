import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';

import { APP_WINSTON_CONFIG } from './common/logger/config';
import { Application } from './entites/application.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ApplicationsModule,
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(APP_WINSTON_CONFIG),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `db/${process.env.DB_NAME}`,
      entities: [Application],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

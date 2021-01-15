import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ApplicationsModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DB_URL}/ig-token-refresher`),
  ],
  controllers: [AppController],
})
export class AppModule {}

import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from 'src/entites/application.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Application])],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}

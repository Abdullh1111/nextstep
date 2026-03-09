import { Module } from '@nestjs/common';
import { SubservicesController } from './subservices.controller';
import { SubservicesService } from './subservices.service';

@Module({
  controllers: [SubservicesController],
  providers: [SubservicesService],
  exports: [SubservicesService],
})
export class SubservicesModule {}

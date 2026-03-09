import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InitService } from './init.service';
import { InitDataDto } from './dto/init-data.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async initializeData(@Body() dto: InitDataDto) {
    return this.initService.initializeData(dto);
  }
}

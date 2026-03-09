import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SubservicesService } from './subservices.service';
import { CreateSubserviceDto } from './dto/create-subservice.dto';
import { UpdateSubserviceDto } from './dto/update-subservice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('subservices')
export class SubservicesController {
  constructor(private readonly subservicesService: SubservicesService) {}

  @Public()
  @Get()
  async findAll() {
    const subservices = await this.subservicesService.findAll();
    return { subservices };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateSubserviceDto) {
    const subservice = await this.subservicesService.create(dto);
    return { subservice };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSubserviceDto) {
    const subservice = await this.subservicesService.update(id, dto);
    return { subservice };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.subservicesService.remove(id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Public()
  @Get()
  async findAll() {
    const scholarships = await this.scholarshipsService.findAll();
    return { scholarships };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateScholarshipDto) {
    const scholarship = await this.scholarshipsService.create(dto);
    return { scholarship };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateScholarshipDto) {
    const scholarship = await this.scholarshipsService.update(id, dto);
    return { scholarship };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.scholarshipsService.remove(id);
  }
}

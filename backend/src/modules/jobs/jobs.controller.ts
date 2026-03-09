import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get()
  async findAll() {
    const jobs = await this.jobsService.findAll();
    return { jobs };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateJobDto) {
    const job = await this.jobsService.create(dto);
    return { job };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    const job = await this.jobsService.update(id, dto);
    return { job };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.jobsService.remove(id);
  }
}

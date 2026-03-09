import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const submissions = await this.submissionsService.findAll();
    return { submissions };
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateSubmissionDto) {
    const submission = await this.submissionsService.create(dto);
    return { submission };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    const submission = await this.submissionsService.update(id, dto);
    return { submission };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.submissionsService.remove(id);
  }
}

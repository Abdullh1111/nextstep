import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  async findAll() {
    const packages = await this.packagesService.findAll();
    return { packages };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePackageDto) {
    const pkg = await this.packagesService.create(dto);
    return { package: pkg };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    const pkg = await this.packagesService.update(id, dto);
    return { package: pkg };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.packagesService.remove(id);
  }
}

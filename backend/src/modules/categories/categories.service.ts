import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      icon: c.icon,
      description: c.description,
    }));
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.serviceCategory.create({
      data: {
        name: dto.name.trim(),
        color: dto.color.trim(),
        icon: dto.icon.trim(),
        description: dto.description.trim(),
      },
    });
    return this.toResponse(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOneOrThrow(id);
    const category = await this.prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(dto.color != null && { color: dto.color.trim() }),
        ...(dto.icon != null && { icon: dto.icon.trim() }),
        ...(dto.description != null && { description: dto.description.trim() }),
      },
    });
    return this.toResponse(category);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.serviceCategory.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const c = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  private toResponse(c: { id: string; name: string; color: string; icon: string; description: string }) {
    return { id: c.id, name: c.name, color: c.color, icon: c.icon, description: c.description };
  }
}

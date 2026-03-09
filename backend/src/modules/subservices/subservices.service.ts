import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubserviceDto } from './dto/create-subservice.dto';
import { UpdateSubserviceDto } from './dto/update-subservice.dto';

@Injectable()
export class SubservicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.subService.findMany({
      orderBy: { name: 'asc' },
    });
    return list.map(this.toResponse);
  }

  async create(dto: CreateSubserviceDto) {
    const sub = await this.prisma.subService.create({
      data: {
        name: dto.name.trim(),
        categoryId: dto.categoryId,
        shortDescription: dto.shortDescription.trim(),
        fullDescription: dto.fullDescription.trim(),
        features: Array.isArray(dto.features) ? dto.features : [],
        benefits: Array.isArray(dto.benefits) ? dto.benefits : [],
        icon: dto.icon?.trim() ?? null,
        image: dto.image?.trim() ?? null,
      },
    });
    return this.toResponse(sub);
  }

  async update(id: string, dto: UpdateSubserviceDto) {
    await this.findOneOrThrow(id);
    const sub = await this.prisma.subService.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(dto.categoryId != null && { categoryId: dto.categoryId }),
        ...(dto.shortDescription != null && { shortDescription: dto.shortDescription.trim() }),
        ...(dto.fullDescription != null && { fullDescription: dto.fullDescription.trim() }),
        ...(dto.features != null && { features: dto.features }),
        ...(dto.benefits != null && { benefits: dto.benefits }),
        ...(dto.icon !== undefined && { icon: dto.icon?.trim() ?? null }),
        ...(dto.image !== undefined && { image: dto.image?.trim() ?? null }),
      },
    });
    return this.toResponse(sub);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.subService.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const s = await this.prisma.subService.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Subservice not found');
    return s;
  }

  private toResponse(s: {
    id: string;
    categoryId: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    features: unknown;
    benefits: unknown;
    icon: string | null;
    image: string | null;
  }) {
    return {
      id: s.id,
      categoryId: s.categoryId,
      name: s.name,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      features: Array.isArray(s.features) ? s.features : [],
      benefits: Array.isArray(s.benefits) ? s.benefits : [],
      icon: s.icon ?? undefined,
      image: s.image ?? undefined,
    };
  }
}

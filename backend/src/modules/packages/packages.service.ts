import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.package.findMany({
      orderBy: { name: 'asc' },
    });
    return list.map(this.toResponse);
  }

  async create(dto: CreatePackageDto) {
    const pkg = await this.prisma.package.create({
      data: {
        serviceId: dto.serviceId,
        name: dto.name.trim(),
        description: dto.description.trim(),
        features: Array.isArray(dto.features) ? dto.features : [],
        price: dto.price.trim(),
        displayPrice: dto.displayPrice ?? true,
      },
    });
    return this.toResponse(pkg);
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOneOrThrow(id);
    const pkg = await this.prisma.package.update({
      where: { id },
      data: {
        ...(dto.serviceId != null && { serviceId: dto.serviceId }),
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(dto.description != null && { description: dto.description.trim() }),
        ...(dto.features != null && { features: dto.features }),
        ...(dto.price != null && { price: dto.price.trim() }),
        ...(dto.displayPrice !== undefined && { displayPrice: dto.displayPrice }),
      },
    });
    return this.toResponse(pkg);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.package.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const p = await this.prisma.package.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Package not found');
    return p;
  }

  private toResponse(p: {
    id: string;
    serviceId: string;
    name: string;
    description: string;
    features: unknown;
    price: string;
    displayPrice: boolean;
  }) {
    return {
      id: p.id,
      serviceId: p.serviceId,
      name: p.name,
      description: p.description,
      features: Array.isArray(p.features) ? p.features : [],
      price: p.price,
      displayPrice: p.displayPrice,
    };
  }
}

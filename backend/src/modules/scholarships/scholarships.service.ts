import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';

@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.scholarship.findMany({
      orderBy: { deadline: 'desc' },
    });
    return list.map(this.toResponse);
  }

  async create(dto: CreateScholarshipDto) {
    const s = await this.prisma.scholarship.create({
      data: {
        title: dto.title.trim(),
        organization: dto.organization.trim(),
        deadline: new Date(dto.deadline),
        country: dto.country.trim(),
        level: dto.level.trim(),
        description: dto.description.trim(),
        eligibility: Array.isArray(dto.eligibility) ? dto.eligibility : [],
        benefits: Array.isArray(dto.benefits) ? dto.benefits : [],
        externalLink: dto.externalLink?.trim() ?? null,
        status: dto.status ?? 'active',
      },
    });
    return this.toResponse(s);
  }

  async update(id: string, dto: UpdateScholarshipDto) {
    await this.findOneOrThrow(id);
    const s = await this.prisma.scholarship.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title.trim() }),
        ...(dto.organization != null && { organization: dto.organization.trim() }),
        ...(dto.deadline != null && { deadline: new Date(dto.deadline) }),
        ...(dto.country != null && { country: dto.country.trim() }),
        ...(dto.level != null && { level: dto.level.trim() }),
        ...(dto.description != null && { description: dto.description.trim() }),
        ...(dto.eligibility != null && { eligibility: dto.eligibility }),
        ...(dto.benefits != null && { benefits: dto.benefits }),
        ...(dto.externalLink !== undefined && { externalLink: dto.externalLink?.trim() ?? null }),
        ...(dto.status != null && { status: dto.status }),
      },
    });
    return this.toResponse(s);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.scholarship.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const s = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Scholarship not found');
    return s;
  }

  private toResponse(s: {
    id: string;
    title: string;
    organization: string;
    deadline: Date;
    country: string;
    level: string;
    description: string;
    eligibility: unknown;
    benefits: unknown;
    externalLink: string | null;
    status: string;
  }) {
    return {
      id: s.id,
      title: s.title,
      organization: s.organization,
      deadline: s.deadline.toISOString().split('T')[0],
      country: s.country,
      level: s.level,
      description: s.description,
      eligibility: Array.isArray(s.eligibility) ? s.eligibility : [],
      benefits: Array.isArray(s.benefits) ? s.benefits : [],
      externalLink: s.externalLink ?? undefined,
      status: s.status,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.job.findMany({
      orderBy: { deadline: 'desc' },
    });
    return list.map(this.toResponse);
  }

  async create(dto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: {
        title: dto.title.trim(),
        organization: dto.organization.trim(),
        deadline: new Date(dto.deadline),
        location: dto.location.trim(),
        type: dto.type.trim(),
        description: dto.description.trim(),
        requirements: Array.isArray(dto.requirements) ? dto.requirements : [],
        externalLink: dto.externalLink?.trim() ?? null,
        status: dto.status ?? 'active',
      },
    });
    return this.toResponse(job);
  }

  async update(id: string, dto: UpdateJobDto) {
    await this.findOneOrThrow(id);
    const job = await this.prisma.job.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title.trim() }),
        ...(dto.organization != null && { organization: dto.organization.trim() }),
        ...(dto.deadline != null && { deadline: new Date(dto.deadline) }),
        ...(dto.location != null && { location: dto.location.trim() }),
        ...(dto.type != null && { type: dto.type.trim() }),
        ...(dto.description != null && { description: dto.description.trim() }),
        ...(dto.requirements != null && { requirements: dto.requirements }),
        ...(dto.externalLink !== undefined && { externalLink: dto.externalLink?.trim() ?? null }),
        ...(dto.status != null && { status: dto.status }),
      },
    });
    return this.toResponse(job);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.job.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const j = await this.prisma.job.findUnique({ where: { id } });
    if (!j) throw new NotFoundException('Job not found');
    return j;
  }

  private toResponse(j: {
    id: string;
    title: string;
    organization: string;
    deadline: Date;
    location: string;
    type: string;
    description: string;
    requirements: unknown;
    externalLink: string | null;
    status: string;
  }) {
    return {
      id: j.id,
      title: j.title,
      organization: j.organization,
      deadline: j.deadline.toISOString().split('T')[0],
      location: j.location,
      type: j.type,
      description: j.description,
      requirements: Array.isArray(j.requirements) ? j.requirements : [],
      externalLink: j.externalLink ?? undefined,
      status: j.status,
    };
  }
}

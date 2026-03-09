import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.formSubmission.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    return list.map(this.toResponse);
  }

  async create(dto: CreateSubmissionDto) {
    const sub = await this.prisma.formSubmission.create({
      data: {
        type: dto.type,
        servicePackageId: dto.servicePackageId?.trim() ?? null,
        jobId: dto.jobId?.trim() ?? null,
        scholarshipId: dto.scholarshipId?.trim() ?? null,
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        email: dto.email.trim().toLowerCase(),
        message: dto.message?.trim() ?? null,
        files: Array.isArray(dto.files) ? dto.files : [],
      },
    });
    return this.toResponse(sub);
  }

  async update(id: string, dto: UpdateSubmissionDto) {
    await this.findOneOrThrow(id);
    const sub = await this.prisma.formSubmission.update({
      where: { id },
      data: {
        ...(dto.status != null && { status: dto.status }),
      },
    });
    return this.toResponse(sub);
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.prisma.formSubmission.delete({ where: { id } });
  }

  private async findOneOrThrow(id: string) {
    const s = await this.prisma.formSubmission.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Submission not found');
    return s;
  }

  private toResponse(s: {
    id: string;
    type: string;
    servicePackageId: string | null;
    jobId: string | null;
    scholarshipId: string | null;
    fullName: string;
    phone: string;
    email: string;
    message: string | null;
    files: unknown;
    submittedAt: Date;
    status: string;
  }) {
    return {
      id: s.id,
      type: s.type,
      servicePackageId: s.servicePackageId ?? undefined,
      jobId: s.jobId ?? undefined,
      scholarshipId: s.scholarshipId ?? undefined,
      fullName: s.fullName,
      phone: s.phone,
      email: s.email,
      message: s.message ?? undefined,
      files: Array.isArray(s.files) ? s.files : [],
      submittedAt: s.submittedAt.toISOString(),
      status: s.status,
    };
  }
}

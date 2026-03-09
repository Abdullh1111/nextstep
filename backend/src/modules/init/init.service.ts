import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InitDataDto } from './dto/init-data.dto';

@Injectable()
export class InitService {
  constructor(private prisma: PrismaService) {}

  async initializeData(dto: InitDataDto) {
    const existing = await this.prisma.serviceCategory.count();
    if (existing > 0) {
      return { message: 'Data already initialized' };
    }

    const categoryIdMap = new Map<string, string>();

    if (dto.categories?.length) {
      for (const c of dto.categories) {
        const id = (c as { id?: string }).id;
        const created = await this.prisma.serviceCategory.create({
          data: {
            ...(id && { id }),
            name: c.name.trim(),
            color: c.color.trim(),
            icon: c.icon.trim(),
            description: c.description.trim(),
          },
        });
        if (id) categoryIdMap.set(id, created.id);
        else categoryIdMap.set(created.id, created.id);
      }
    }

    const subServiceIdMap = new Map<string, string>();

    if (dto.subservices?.length) {
      for (const s of dto.subservices) {
        const categoryId = categoryIdMap.get(s.categoryId) ?? (await this.prisma.serviceCategory.findFirst())?.id;
        if (!categoryId) continue;
        const id = (s as { id?: string }).id;
        const created = await this.prisma.subService.create({
          data: {
            ...(id && { id }),
            categoryId,
            name: s.name.trim(),
            shortDescription: s.shortDescription.trim(),
            fullDescription: s.fullDescription.trim(),
            features: Array.isArray(s.features) ? s.features : [],
            benefits: Array.isArray(s.benefits) ? s.benefits : [],
            icon: s.icon?.trim() ?? null,
            image: s.image?.trim() ?? null,
          },
        });
        if (id) subServiceIdMap.set(id, created.id);
        else subServiceIdMap.set(created.id, created.id);
      }
    }

    if (dto.packages?.length) {
      for (const p of dto.packages) {
        const serviceId = subServiceIdMap.get(p.serviceId) ?? (await this.prisma.subService.findFirst())?.id;
        if (!serviceId) continue;
        const id = (p as { id?: string }).id;
        await this.prisma.package.create({
          data: {
            ...(id && { id }),
            serviceId,
            name: p.name.trim(),
            description: p.description.trim(),
            features: Array.isArray(p.features) ? p.features : [],
            price: p.price.trim(),
            displayPrice: p.displayPrice ?? true,
          },
        });
      }
    }

    if (dto.jobs?.length) {
      for (const j of dto.jobs) {
        const id = (j as { id?: string }).id;
        await this.prisma.job.create({
          data: {
            ...(id && { id }),
            title: j.title.trim(),
            organization: j.organization.trim(),
            deadline: new Date(j.deadline),
            location: j.location.trim(),
            type: j.type.trim(),
            description: j.description.trim(),
            requirements: Array.isArray(j.requirements) ? j.requirements : [],
            externalLink: j.externalLink?.trim() ?? null,
            status: (j.status as 'active' | 'inactive') ?? 'active',
          },
        });
      }
    }

    if (dto.scholarships?.length) {
      for (const s of dto.scholarships) {
        const id = (s as { id?: string }).id;
        await this.prisma.scholarship.create({
          data: {
            ...(id && { id }),
            title: s.title.trim(),
            organization: s.organization.trim(),
            deadline: new Date(s.deadline),
            country: s.country.trim(),
            level: s.level.trim(),
            description: s.description.trim(),
            eligibility: Array.isArray(s.eligibility) ? s.eligibility : [],
            benefits: Array.isArray(s.benefits) ? s.benefits : [],
            externalLink: s.externalLink?.trim() ?? null,
            status: (s.status as 'active' | 'inactive') ?? 'active',
          },
        });
      }
    }

    return { message: 'Data initialized' };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.settings.findFirst();
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {},
      });
    }
    return {
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      facebook: settings.facebook,
      twitter: settings.twitter,
      linkedin: settings.linkedin,
      instagram: settings.instagram,
      whatsapp: settings.whatsapp,
      aboutText: settings.aboutText,
      footerText: settings.footerText,
    };
  }

  async update(dto: UpdateSettingsDto) {
    let settings = await this.prisma.settings.findFirst();
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {},
      });
    }
    const updated = await this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        ...(dto.siteName !== undefined && { siteName: dto.siteName }),
        ...(dto.contactEmail !== undefined && { contactEmail: dto.contactEmail }),
        ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.facebook !== undefined && { facebook: dto.facebook }),
        ...(dto.twitter !== undefined && { twitter: dto.twitter }),
        ...(dto.linkedin !== undefined && { linkedin: dto.linkedin }),
        ...(dto.instagram !== undefined && { instagram: dto.instagram }),
        ...(dto.whatsapp !== undefined && { whatsapp: dto.whatsapp }),
        ...(dto.aboutText !== undefined && { aboutText: dto.aboutText }),
        ...(dto.footerText !== undefined && { footerText: dto.footerText }),
      },
    });
    return {
      siteName: updated.siteName,
      contactEmail: updated.contactEmail,
      contactPhone: updated.contactPhone,
      address: updated.address,
      facebook: updated.facebook,
      twitter: updated.twitter,
      linkedin: updated.linkedin,
      instagram: updated.instagram,
      whatsapp: updated.whatsapp,
      aboutText: updated.aboutText,
      footerText: updated.footerText,
    };
  }
}

import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryItemDto {
  id?: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

class SubserviceItemDto {
  id?: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  features?: string[];
  benefits?: string[];
  icon?: string;
  image?: string;
}

class PackageItemDto {
  id?: string;
  serviceId: string;
  name: string;
  description: string;
  features?: string[];
  price: string;
  displayPrice?: boolean;
}

class JobItemDto {
  id?: string;
  title: string;
  organization: string;
  deadline: string;
  location: string;
  type: string;
  description: string;
  requirements?: string[];
  externalLink?: string;
  status?: string;
}

class ScholarshipItemDto {
  id?: string;
  title: string;
  organization: string;
  deadline: string;
  country: string;
  level: string;
  description: string;
  eligibility?: string[];
  benefits?: string[];
  externalLink?: string;
  status?: string;
}

export class InitDataDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryItemDto)
  categories?: CategoryItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubserviceItemDto)
  subservices?: SubserviceItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItemDto)
  packages?: PackageItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobItemDto)
  jobs?: JobItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScholarshipItemDto)
  scholarships?: ScholarshipItemDto[];
}

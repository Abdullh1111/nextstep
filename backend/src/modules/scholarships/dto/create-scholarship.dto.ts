import { IsString, MinLength, IsArray, IsIn, IsUrl, IsOptional } from 'class-validator';

export class CreateScholarshipDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  organization: string;

  @IsString()
  deadline: string;

  @IsString()
  @MinLength(1)
  country: string;

  @IsString()
  @MinLength(1)
  level: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsArray()
  eligibility: string[];

  @IsArray()
  benefits: string[];

  @IsOptional()
  @IsUrl()
  externalLink?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

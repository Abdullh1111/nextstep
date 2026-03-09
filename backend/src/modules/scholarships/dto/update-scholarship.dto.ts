import { IsString, MinLength, IsArray, IsIn, IsUrl, IsOptional } from 'class-validator';

export class UpdateScholarshipDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  organization?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  level?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsArray()
  eligibility?: string[];

  @IsOptional()
  @IsArray()
  benefits?: string[];

  @IsOptional()
  @IsUrl()
  externalLink?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

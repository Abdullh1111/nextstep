import { IsString, MinLength, IsArray, IsIn, IsUrl, IsOptional } from 'class-validator';

export class CreateJobDto {
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
  location: string;

  @IsString()
  @MinLength(1)
  type: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsArray()
  requirements: string[];

  @IsOptional()
  @IsUrl()
  externalLink?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

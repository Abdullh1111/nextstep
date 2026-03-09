import { IsString, MinLength, IsEmail, IsIn, IsArray, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsIn(['service', 'job', 'scholarship'])
  type: 'service' | 'job' | 'scholarship';

  @IsOptional()
  @IsString()
  servicePackageId?: string;

  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsString()
  scholarshipId?: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  files?: string[];
}

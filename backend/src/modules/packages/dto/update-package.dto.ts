import { IsString, MinLength, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  serviceId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  price?: string;

  @IsOptional()
  @IsBoolean()
  displayPrice?: boolean;
}

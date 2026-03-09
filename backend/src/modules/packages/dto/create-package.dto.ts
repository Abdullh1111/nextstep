import { IsString, MinLength, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @MinLength(1)
  serviceId: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsArray()
  features: string[];

  @IsString()
  @MinLength(1)
  price: string;

  @IsOptional()
  @IsBoolean()
  displayPrice?: boolean;
}

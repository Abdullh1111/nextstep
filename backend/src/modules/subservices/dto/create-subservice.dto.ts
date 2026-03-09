import { IsString, MinLength, IsArray, IsOptional } from 'class-validator';

export class CreateSubserviceDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  categoryId: string;

  @IsString()
  @MinLength(1)
  shortDescription: string;

  @IsString()
  @MinLength(1)
  fullDescription: string;

  @IsArray()
  features: string[];

  @IsArray()
  benefits: string[];

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

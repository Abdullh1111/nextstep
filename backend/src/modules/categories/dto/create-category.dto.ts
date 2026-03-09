import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  color: string;

  @IsString()
  @MinLength(1)
  icon: string;

  @IsString()
  @MinLength(1)
  description: string;
}

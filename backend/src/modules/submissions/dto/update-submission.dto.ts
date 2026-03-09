import { IsIn, IsOptional } from 'class-validator';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsIn(['pending', 'contacted', 'completed'])
  status?: 'pending' | 'contacted' | 'completed';
}

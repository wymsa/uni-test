import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class GetRevenueDto {
  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;

  @IsString()
  @IsIn(['facebook', 'tiktok'])
  source: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

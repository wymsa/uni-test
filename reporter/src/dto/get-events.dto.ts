import { Type } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetEventsDto {
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
  @IsNotEmpty()
  funnelStage: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;
}

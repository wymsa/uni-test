import { Injectable } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { GetEventsDto } from './dto/get-events.dto';
import { GetRevenueDto } from './dto/get-revenue.dto';

@Injectable()
export class AppService {
  constructor(private readonly natsService: NatsService) {}

  async getEvents(filters: GetEventsDto): Promise<any> {
    const { from, to, source, funnelStage, eventType } = filters;
    return await this.natsService.request(`reports.${source}.events`, {
      from,
      to,
      source,
      funnelStage,
      eventType
    });
  }

  async getRevenue(filters: GetRevenueDto): Promise<any> {
    const { from, to, source, campaignId } = filters;
    return await this.natsService.request(`reports.${source}.revenue`, {
      from,
      to,
      source,
      campaignId
    });
  }
}

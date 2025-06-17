import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetEventsDto } from './dto/get-events.dto';
import { GetRevenueDto } from './dto/get-revenue.dto';

@Controller('/reports')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/events')
  getEvents(@Query() filter: GetEventsDto) {
    return this.appService.getEvents(filter);
  }

  @Get('/revenue')
  getRevenue(@Query() filter: GetRevenueDto) {
    return this.appService.getRevenue(filter);
  }
}

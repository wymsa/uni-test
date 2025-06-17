import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FlexibleEventsInput } from './dto/event.dto';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('webhook')
  async handleWebhook(@Body() eventDto: FlexibleEventsInput): Promise<string> {
    if (Array.isArray(eventDto)) {
      for (const event of eventDto) {
        if (event.source === 'facebook') {
          await this.appService.publishFacebookEvent(event);
        } else if (event.source === 'tiktok') {
          await this.appService.publishTiktokEvent(event);
        }
      }
    } else {
      if (eventDto.source === 'facebook') {
        await this.appService.publishFacebookEvent(eventDto);
      } else if (eventDto.source === 'tiktok') {
        await this.appService.publishTiktokEvent(eventDto);
      }
    }

    return 'OK';
  }
}

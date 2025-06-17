import { Injectable, Logger } from '@nestjs/common';
import { NatsService } from './nats/nats.service';
import { FacebookEvent, TiktokEvent } from './dto/event.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly natsService: NatsService) {}

  async publishFacebookEvent(event: FacebookEvent) {
    try {
      await this.natsService.publish('events.facebook', event);
      this.logger.log('New event accepted. Event ID:', event.eventId);
    } catch (error) {
      this.logger.error('Event accepting error:', error);
    }
  }

  async publishTiktokEvent(event: TiktokEvent) {
    try {
      await this.natsService.publish('events.tiktok', event);
      this.logger.log('New event accepted. Event ID:', event.eventId);
    } catch (error) {
      this.logger.error('Event accepting error:', error);
    }
  }
}

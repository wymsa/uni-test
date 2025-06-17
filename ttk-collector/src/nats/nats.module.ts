import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [NatsService]
})
export class NatsModule {}

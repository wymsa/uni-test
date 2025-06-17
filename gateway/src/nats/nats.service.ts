import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, headers, JetStreamClient, NatsConnection, StringCodec } from 'nats';
import { Event } from 'src/dto/event.dto';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsService.name);
  private natsConnection: NatsConnection;
  private jetStream: JetStreamClient;
  private stringCodec = StringCodec();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.natsConnection.drain();
  }

  async connect() {
    try {
      this.natsConnection = await connect({
        servers: this.configService.getOrThrow<string | string[]>('NATS_SERVER')
      });
      this.jetStream = this.natsConnection.jetstream();
      this.logger.log('NATS connected');
    } catch (error) {
      this.logger.error('NATS connection error', error);
    }
  }

  async publish(subject: string, payload: Event) {
    try {
      const data = this.stringCodec.encode(JSON.stringify(payload));
      const h = headers();
      h.set('correlatonId', payload.eventId);

      await this.jetStream.publish(subject, data, { headers: h });
      this.logger.log(
        `Event published to subject ${subject} with correlationId: ${h.get('correlatonId')}`
      );
    } catch (error) {
      this.logger.error('Event publish error', error.message);
    }
  }
}

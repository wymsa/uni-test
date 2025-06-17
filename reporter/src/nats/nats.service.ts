import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsConnection, StringCodec, connect } from 'nats';
import { ReporterEvents } from 'src/types';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsService.name);
  private natsConnection: NatsConnection;
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
      this.logger.log('NATS connected');
    } catch (error) {
      this.logger.error('NATS connection error', error.message);
    }
  }

  async request(subject: string, filters: ReporterEvents) {
    try {
      const reply = await this.natsConnection.request(
        subject,
        this.stringCodec.encode(JSON.stringify(filters)),
        { timeout: 2000 }
      );

      return JSON.parse(this.stringCodec.decode(reply.data)) as unknown;
    } catch (error) {
      this.logger.error('Reporter request error', error);
    }
  }
}

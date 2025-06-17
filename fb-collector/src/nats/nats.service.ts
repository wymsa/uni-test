import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AckPolicy,
  connect,
  DeliverPolicy,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
  StringCodec
} from 'nats';
import { EventsService } from 'src/events/events.service';
import { FacebookEvent, GetEventsFilter, GetRevenueFilter, ReporterEvents } from 'src/types';

@Injectable()
export class NatsService implements OnModuleInit {
  private readonly logger = new Logger(NatsService.name);
  private natsConnection: NatsConnection;
  private jetStreamManager: JetStreamManager;
  private jetStream: JetStreamClient;
  private stringCodec = StringCodec();

  constructor(
    private readonly eventsService: EventsService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    await this.connect();

    await Promise.allSettled([
      this.startConsume(async (message: JsMsg, data: FacebookEvent) => {
        this.logger.log(
          `Received event on ${message.subject} with correlationId: ${message.headers?.get('correlatonId')}`
        );
        await this.eventsService.createEvent(data);
      }),
      this.startRespond('reports.facebook.events', async (filters: GetEventsFilter) => {
        this.logger.log('Received event on reports.facebook.events');
        return await this.eventsService.getEvents(filters);
      }),
      this.startRespond('reports.facebook.revenue', async (filters: GetRevenueFilter) => {
        this.logger.log('Received event on reports.facebook.revenue');
        return await this.eventsService.getRevenue(filters);
      })
    ]);
  }

  async connect() {
    try {
      this.natsConnection = await connect({
        servers: this.configService.getOrThrow<string | string[]>('NATS_SERVER')
      });
      this.jetStream = this.natsConnection.jetstream();
      this.jetStreamManager = await this.natsConnection.jetstreamManager();
      this.logger.log('NATS connected');
    } catch (error) {
      this.logger.error('NATS connection error', error);
    }
  }

  async createConsumer(durableName: string) {
    try {
      await this.jetStreamManager.consumers.add('events', {
        durable_name: durableName,
        ack_policy: AckPolicy.Explicit,
        filter_subject: 'events.facebook',
        deliver_policy: DeliverPolicy.All,
        max_batch: 1000
      });
    } catch (error) {
      if (error.message?.includes('already exists')) {
        this.logger.log(`Consumer ${durableName} already exists`);
      } else {
        this.logger.error('NATS Consumer create error', error);
      }
    }
  }

  async startConsume(cb: (message: JsMsg, data: FacebookEvent) => Promise<void>) {
    await this.createConsumer('fb-collector');

    try {
      const consumer = await this.jetStream.consumers.get('events', 'fb-collector');

      const messages = await consumer.consume({ max_messages: 1000 });

      for await (const message of messages) {
        try {
          const data = JSON.parse(this.stringCodec.decode(message.data)) as FacebookEvent;

          await cb(message, data);
          message.ack();
        } catch (error) {
          this.logger.error(`Received message error`, error);
          message.term();
        }
      }
    } catch (error) {
      this.logger.error('NATS subscribe error', error);
    }
  }

  async startRespond(subject: string, cb: (filters: ReporterEvents) => Promise<any>) {
    try {
      const sub = this.natsConnection.subscribe(subject);
      this.logger.log(`Listening for requests on [${subject}]`);

      for await (const msg of sub) {
        const filters = JSON.parse(this.stringCodec.decode(msg.data)) as ReporterEvents;

        const events = (await cb(filters)) as unknown;

        msg.respond(this.stringCodec.encode(JSON.stringify(events)));
      }
    } catch (error) {
      this.logger.error('NATS respond error', error);
    }
  }
}

import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NatsModule,
    PrismaModule,
    EventsModule,
    HealthModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true })
  ]
})
export class AppModule {}

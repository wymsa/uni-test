import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { NatsModule } from './nats/nats.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    NatsModule,
    PrismaModule,
    EventsModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    HealthModule
  ]
})
export class AppModule {}

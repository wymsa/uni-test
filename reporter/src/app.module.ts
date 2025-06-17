import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsModule } from './nats/nats.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [NatsModule, ConfigModule.forRoot({ cache: true, isGlobal: true }), HealthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

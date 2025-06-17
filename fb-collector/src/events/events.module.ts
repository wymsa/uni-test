import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}

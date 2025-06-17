import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetEventsFilter,
  GetRevenueFilter,
  TiktokEngagement,
  TiktokEngagementBottom,
  TiktokEngagementTop,
  TiktokEvent
} from 'src/types';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(data: TiktokEvent) {
    let engagement: TiktokEngagement;

    if (data.funnelStage === 'top') {
      const { country, device, percentageWatched, videoId, watchTime } = data.data
        .engagement as TiktokEngagementTop;
      engagement = {
        country,
        device,
        percentageWatched,
        videoId,
        watchTime
      };
    } else if (data.funnelStage === 'bottom') {
      const { actionTime, profileId, purchaseAmount, purchasedItem } = data.data
        .engagement as TiktokEngagementBottom;
      engagement = {
        actionTime,
        profileId,
        purchaseAmount,
        purchasedItem
      };
    } else {
      throw new Error('Unknown funnelStage:', data.funnelStage);
    }

    await this.prismaService.tiktokEvent.create({
      data: {
        eventId: data.eventId,
        timestamp: data.timestamp,
        source: data.source,
        funnelStage: data.funnelStage,
        eventType: data.eventType,
        user: {
          connectOrCreate: {
            where: { userId: data.data.user.userId },
            create: {
              userId: data.data.user.userId,
              username: data.data.user.username,
              followers: data.data.user.followers
            }
          }
        },
        engagement: {
          create: engagement
        }
      }
    });
  }

  async getEvents(filter: GetEventsFilter) {
    const { from, to, source, funnelStage, eventType } = filter;

    return await this.prismaService.tiktokEvent.groupBy({
      by: ['eventType'],
      where: {
        timestamp: { gte: from, lte: to },
        source: source,
        funnelStage: funnelStage,
        eventType: eventType
      },
      _count: true
    });
  }

  async getRevenue(filter: GetRevenueFilter) {
    const { from, to, source } = filter;

    const events = await this.prismaService.tiktokEvent.findMany({
      where: {
        source: source,
        timestamp: {
          gte: from,
          lte: to
        },
        eventType: 'purchase'
      },
      select: {
        engagement: {
          select: {
            purchaseAmount: true
          }
        }
      }
    });

    const totalRevenue = events.reduce((sum, event) => {
      const value = parseFloat(event.engagement.purchaseAmount || '0');
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    return { revenue: totalRevenue.toFixed(2) };
  }
}

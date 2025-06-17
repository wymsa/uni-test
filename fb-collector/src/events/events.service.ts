import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FacebookEngagement,
  FacebookEngagementBottom,
  FacebookEngagementTop,
  FacebookEvent,
  GetEventsFilter,
  GetRevenueFilter
} from 'src/types';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(data: FacebookEvent) {
    let engagement: FacebookEngagement;

    if (data.funnelStage === 'top') {
      const { actionTime, referrer, videoId } = data.data.engagement as FacebookEngagementTop;
      engagement = {
        actionTime: actionTime,
        referrer: referrer,
        videoId: videoId
      };
    } else if (data.funnelStage === 'bottom') {
      const { adId, browser, campaignId, clickPosition, device, purchaseAmount } = data.data
        .engagement as FacebookEngagementBottom;
      engagement = {
        adId: adId,
        campaignId: campaignId,
        clickPosition: clickPosition,
        device: device,
        browser: browser,
        purchaseAmount: purchaseAmount
      };
    } else {
      throw new Error('Unknown funnelStage:', data.funnelStage);
    }

    await this.prismaService.facebookEvent.create({
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
              name: data.data.user.name,
              age: data.data.user.age,
              gender: data.data.user.gender,
              location: {
                connectOrCreate: {
                  where: {
                    country_city_unique: {
                      country: data.data.user.location.country,
                      city: data.data.user.location.city
                    }
                  },
                  create: {
                    country: data.data.user.location.country,
                    city: data.data.user.location.city
                  }
                }
              }
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

    return await this.prismaService.facebookEvent.groupBy({
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
    const { from, to, source, campaignId } = filter;

    const events = await this.prismaService.facebookEvent.findMany({
      where: {
        source: source,
        timestamp: {
          gte: from,
          lte: to
        },
        eventType: 'checkout.complete',
        ...(campaignId ? { engagement: { campaignId } } : {})
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

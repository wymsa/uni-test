import { z } from 'zod';

// --- Facebook Schemas ---

const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string()
});

const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(['male', 'female', 'non-binary']),
  location: FacebookUserLocationSchema
});

const FacebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(['newsfeed', 'marketplace', 'groups']),
  videoId: z.string().nullable()
});

const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(['top_left', 'bottom_right', 'center']),
  device: z.enum(['mobile', 'desktop']),
  browser: z.enum(['Chrome', 'Firefox', 'Safari']),
  purchaseAmount: z.string().nullable()
});

const FacebookTopEventTypeSchema = z.enum(['ad.view', 'page.like', 'comment', 'video.view']);
const FacebookBottomEventTypeSchema = z.enum(['ad.click', 'form.submission', 'checkout.complete']);

const FacebookEventDataTopSchema = z.object({
  user: FacebookUserSchema,
  engagement: FacebookEngagementTopSchema
});

const FacebookEventDataBottomSchema = z.object({
  user: FacebookUserSchema,
  engagement: FacebookEngagementBottomSchema
});

const FacebookEventTopSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('facebook'),
  funnelStage: z.literal('top'),
  eventType: FacebookTopEventTypeSchema,
  data: FacebookEventDataTopSchema
});

const FacebookEventBottomSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('facebook'),
  funnelStage: z.literal('bottom'),
  eventType: FacebookBottomEventTypeSchema,
  data: FacebookEventDataBottomSchema
});

// --- TikTok Schemas ---

const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number()
});

const TiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.enum(['Android', 'iOS', 'Desktop']),
  country: z.string(),
  videoId: z.string()
});

const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable()
});

const TiktokTopEventTypeSchema = z.enum(['video.view', 'like', 'share', 'comment']);
const TiktokBottomEventTypeSchema = z.enum(['profile.visit', 'purchase', 'follow']);

const TiktokEventDataTopSchema = z.object({
  user: TiktokUserSchema,
  engagement: TiktokEngagementTopSchema
});

const TiktokEventDataBottomSchema = z.object({
  user: TiktokUserSchema,
  engagement: TiktokEngagementBottomSchema
});

const TiktokEventTopSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('tiktok'),
  funnelStage: z.literal('top'),
  eventType: TiktokTopEventTypeSchema,
  data: TiktokEventDataTopSchema
});

const TiktokEventBottomSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('tiktok'),
  funnelStage: z.literal('bottom'),
  eventType: TiktokBottomEventTypeSchema,
  data: TiktokEventDataBottomSchema
});

// --- Main Event Schemas ---

export const FacebookEventSchema = z.discriminatedUnion('funnelStage', [
  FacebookEventTopSchema,
  FacebookEventBottomSchema
]);

export const TiktokEventSchema = z.discriminatedUnion('funnelStage', [
  TiktokEventTopSchema,
  TiktokEventBottomSchema
]);

export const EventSchema = z.union([FacebookEventSchema, TiktokEventSchema]);

// --- Array and Request Body Schemas ---

export const EventsArraySchema = z.array(EventSchema);

export const FlexibleEventsSchema = z.union([
  EventsArraySchema, // Прямой массив событий
  EventSchema // Объект
]);

export type FacebookEvent = z.infer<typeof FacebookEventSchema>;
export type TiktokEvent = z.infer<typeof TiktokEventSchema>;
export type Event = FacebookEvent | TiktokEvent;
export type FlexibleEventsInput = z.infer<typeof FlexibleEventsSchema>;

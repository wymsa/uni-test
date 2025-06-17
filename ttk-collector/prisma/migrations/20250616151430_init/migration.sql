-- CreateTable
CREATE TABLE "TiktokEvent" (
    "event_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "engagement_id" INTEGER NOT NULL,

    CONSTRAINT "TiktokEvent_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "TiktokEngagement" (
    "id" SERIAL NOT NULL,
    "watch_time" INTEGER,
    "percentage_watched" INTEGER,
    "device" TEXT,
    "country" TEXT,
    "video_id" TEXT,
    "action_time" TIMESTAMP(3),
    "profile_id" TEXT,
    "purchased_item" TEXT,
    "purchase_amount" TEXT,

    CONSTRAINT "TiktokEngagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "TiktokUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "TiktokEngagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

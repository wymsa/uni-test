-- CreateTable
CREATE TABLE "FacebookEvent" (
    "event_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "engagement_id" INTEGER NOT NULL,

    CONSTRAINT "FacebookEvent_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "FacebookUser" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "location_id" INTEGER NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "FacebookEngagement" (
    "id" SERIAL NOT NULL,
    "action_time" TIMESTAMP(3),
    "referrer" TEXT,
    "video_id" TEXT,
    "ad_id" TEXT,
    "campaign_id" TEXT,
    "click_position" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "purchase_amount" TEXT,

    CONSTRAINT "FacebookEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookUserLocation" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookUserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacebookUserLocation_country_city_key" ON "FacebookUserLocation"("country", "city");

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "FacebookUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "FacebookEngagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookUser" ADD CONSTRAINT "FacebookUser_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "FacebookUserLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `vehicleInfo` on the `Driver` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingMode" AS ENUM ('instant', 'inquiry');

-- CreateEnum
CREATE TYPE "DepartureStatus" AS ENUM ('available', 'filling_fast', 'almost_full', 'sold_out', 'cancelled');

-- AlterTable
ALTER TABLE "BookingDriver" ADD COLUMN     "vehicleId" TEXT;

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "vehicleInfo";

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "bookingMode" "BookingMode" NOT NULL DEFAULT 'instant';

-- AlterTable
ALTER TABLE "TourInquiry" ADD COLUMN     "travelDateFrom" TIMESTAMP(3),
ADD COLUMN     "travelDateTo" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TourDeparture" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxSpots" INTEGER NOT NULL,
    "spotsRemaining" INTEGER NOT NULL,
    "status" "DepartureStatus" NOT NULL DEFAULT 'available',
    "priceModifier" DECIMAL(4,2),
    "isGuaranteed" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourDeparture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourPricingTier" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "minGuests" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "pricePerPerson" DECIMAL(10,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourPricingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourPricingTierTranslation" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourPricingTierTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "color" TEXT,
    "capacity" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'sedan',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TourDeparture_tourId_idx" ON "TourDeparture"("tourId");

-- CreateIndex
CREATE INDEX "TourDeparture_startDate_idx" ON "TourDeparture"("startDate");

-- CreateIndex
CREATE INDEX "TourDeparture_status_idx" ON "TourDeparture"("status");

-- CreateIndex
CREATE INDEX "TourDeparture_isActive_idx" ON "TourDeparture"("isActive");

-- CreateIndex
CREATE INDEX "TourPricingTier_tourId_idx" ON "TourPricingTier"("tourId");

-- CreateIndex
CREATE INDEX "TourPricingTier_order_idx" ON "TourPricingTier"("order");

-- CreateIndex
CREATE INDEX "TourPricingTierTranslation_locale_idx" ON "TourPricingTierTranslation"("locale");

-- CreateIndex
CREATE INDEX "TourPricingTierTranslation_tierId_idx" ON "TourPricingTierTranslation"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "TourPricingTierTranslation_tierId_locale_key" ON "TourPricingTierTranslation"("tierId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "Vehicle_driverId_idx" ON "Vehicle"("driverId");

-- CreateIndex
CREATE INDEX "Vehicle_plateNumber_idx" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "Vehicle_isActive_idx" ON "Vehicle"("isActive");

-- CreateIndex
CREATE INDEX "BookingDriver_vehicleId_idx" ON "BookingDriver"("vehicleId");

-- AddForeignKey
ALTER TABLE "TourDeparture" ADD CONSTRAINT "TourDeparture_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourPricingTier" ADD CONSTRAINT "TourPricingTier_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourPricingTierTranslation" ADD CONSTRAINT "TourPricingTierTranslation_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "TourPricingTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDriver" ADD CONSTRAINT "BookingDriver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

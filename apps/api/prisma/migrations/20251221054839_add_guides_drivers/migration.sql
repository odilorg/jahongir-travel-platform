-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "languages" TEXT[],
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "licenseNumber" TEXT,
    "vehicleInfo" TEXT,
    "languages" TEXT[],
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingGuide" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "BookingGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingDriver" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "BookingDriver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Guide_isActive_idx" ON "Guide"("isActive");

-- CreateIndex
CREATE INDEX "Guide_name_idx" ON "Guide"("name");

-- CreateIndex
CREATE INDEX "Driver_isActive_idx" ON "Driver"("isActive");

-- CreateIndex
CREATE INDEX "Driver_name_idx" ON "Driver"("name");

-- CreateIndex
CREATE INDEX "BookingGuide_bookingId_idx" ON "BookingGuide"("bookingId");

-- CreateIndex
CREATE INDEX "BookingGuide_guideId_idx" ON "BookingGuide"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingGuide_bookingId_guideId_key" ON "BookingGuide"("bookingId", "guideId");

-- CreateIndex
CREATE INDEX "BookingDriver_bookingId_idx" ON "BookingDriver"("bookingId");

-- CreateIndex
CREATE INDEX "BookingDriver_driverId_idx" ON "BookingDriver"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingDriver_bookingId_driverId_key" ON "BookingDriver"("bookingId", "driverId");

-- AddForeignKey
ALTER TABLE "BookingGuide" ADD CONSTRAINT "BookingGuide_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingGuide" ADD CONSTRAINT "BookingGuide_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDriver" ADD CONSTRAINT "BookingDriver_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDriver" ADD CONSTRAINT "BookingDriver_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

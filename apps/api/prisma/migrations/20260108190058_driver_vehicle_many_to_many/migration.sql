-- CreateTable: DriverVehicle junction table for Many-to-Many relationship
CREATE TABLE "DriverVehicle" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverVehicle_pkey" PRIMARY KEY ("id")
);

-- Migrate existing Vehicle.driverId data to DriverVehicle junction table
INSERT INTO "DriverVehicle" ("id", "driverId", "vehicleId", "isPrimary", "assignedAt")
SELECT
    gen_random_uuid()::text,
    "driverId",
    "id",
    true,  -- Mark as primary since it was the only assignment
    CURRENT_TIMESTAMP
FROM "Vehicle"
WHERE "driverId" IS NOT NULL;

-- Drop the foreign key constraint and index from Vehicle
DROP INDEX IF EXISTS "Vehicle_driverId_idx";
ALTER TABLE "Vehicle" DROP CONSTRAINT IF EXISTS "Vehicle_driverId_fkey";

-- Drop the driverId column from Vehicle
ALTER TABLE "Vehicle" DROP COLUMN "driverId";

-- CreateIndex: DriverVehicle indexes
CREATE UNIQUE INDEX "DriverVehicle_driverId_vehicleId_key" ON "DriverVehicle"("driverId", "vehicleId");
CREATE INDEX "DriverVehicle_driverId_idx" ON "DriverVehicle"("driverId");
CREATE INDEX "DriverVehicle_vehicleId_idx" ON "DriverVehicle"("vehicleId");

-- AddForeignKey: DriverVehicle relations
ALTER TABLE "DriverVehicle" ADD CONSTRAINT "DriverVehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DriverVehicle" ADD CONSTRAINT "DriverVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

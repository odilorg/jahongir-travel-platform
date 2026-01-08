-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "SupplierCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierContract" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "terms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractRate" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "supplierType" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideRate" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverRate" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupplierCompany_name_idx" ON "SupplierCompany"("name");

-- CreateIndex
CREATE INDEX "SupplierCompany_isActive_idx" ON "SupplierCompany"("isActive");

-- CreateIndex
CREATE INDEX "SupplierContract_companyId_idx" ON "SupplierContract"("companyId");

-- CreateIndex
CREATE INDEX "SupplierContract_status_idx" ON "SupplierContract"("status");

-- CreateIndex
CREATE INDEX "SupplierContract_startDate_idx" ON "SupplierContract"("startDate");

-- CreateIndex
CREATE INDEX "SupplierContract_endDate_idx" ON "SupplierContract"("endDate");

-- CreateIndex
CREATE INDEX "ContractRate_contractId_idx" ON "ContractRate"("contractId");

-- CreateIndex
CREATE INDEX "ContractRate_supplierType_idx" ON "ContractRate"("supplierType");

-- CreateIndex
CREATE INDEX "ContractRate_serviceType_idx" ON "ContractRate"("serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "ContractRate_contractId_supplierType_serviceType_key" ON "ContractRate"("contractId", "supplierType", "serviceType");

-- CreateIndex
CREATE INDEX "GuideRate_guideId_idx" ON "GuideRate"("guideId");

-- CreateIndex
CREATE INDEX "GuideRate_serviceType_idx" ON "GuideRate"("serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "GuideRate_guideId_serviceType_key" ON "GuideRate"("guideId", "serviceType");

-- CreateIndex
CREATE INDEX "DriverRate_driverId_idx" ON "DriverRate"("driverId");

-- CreateIndex
CREATE INDEX "DriverRate_serviceType_idx" ON "DriverRate"("serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "DriverRate_driverId_serviceType_key" ON "DriverRate"("driverId", "serviceType");

-- CreateIndex
CREATE INDEX "Driver_companyId_idx" ON "Driver"("companyId");

-- CreateIndex
CREATE INDEX "Guide_companyId_idx" ON "Guide"("companyId");

-- AddForeignKey
ALTER TABLE "SupplierContract" ADD CONSTRAINT "SupplierContract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "SupplierCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractRate" ADD CONSTRAINT "ContractRate_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "SupplierContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "SupplierCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideRate" ADD CONSTRAINT "GuideRate_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "SupplierCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRate" ADD CONSTRAINT "DriverRate_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

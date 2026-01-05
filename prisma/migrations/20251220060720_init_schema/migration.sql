/*
  Warnings:

  - A unique constraint covering the columns `[empCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adharNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uanNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `WorkHoursConfigurationId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punchId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateEnum
CREATE TYPE "UserStates" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'MONTH_PAY', 'YEAR_PAY', 'SOLD');

-- CreateEnum
CREATE TYPE "workHoursModal" AS ENUM ('GENERAL_TIME_COVER', 'FULL_DAY_TIME_COVER', 'SHIFT_TIME_COVER', 'DAY_WHAT_EVER_TIME_COVER');

-- CreateEnum
CREATE TYPE "PunchLogType" AS ENUM ('IN', 'OUT', 'JUSTIFY', 'PERMISION', 'LEAVE', 'LOGFIX');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "SecondaryMobile" TEXT,
ADD COLUMN     "WorkHoursConfigurationId" INTEGER NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "adharNumber" TEXT,
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documets" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "email" TEXT,
ADD COLUMN     "empCode" TEXT NOT NULL,
ADD COLUMN     "epfNumber" TEXT,
ADD COLUMN     "esicNumber" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "isDetele" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ADD COLUMN     "pinCode" TEXT NOT NULL,
ADD COLUMN     "punchId" INTEGER NOT NULL,
ADD COLUMN     "roleId" INTEGER,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "UserStates" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "uanNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CompanyConfig" (
    "id" SERIAL NOT NULL,
    "isCompanyWentTour" BOOLEAN NOT NULL,
    "themeSetting" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "CompanyConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanHistory" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "version" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "tierOfPlan" "PlanType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "PlanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "logoUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gstinNumber" TEXT,
    "sacNumber" TEXT,
    "panNumber" TEXT,
    "esicNumber" TEXT,
    "epfNumber" TEXT,
    "serviceTaxNumber" TEXT,
    "websiteLink" TEXT,
    "documets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "privileges" JSONB NOT NULL DEFAULT '{}',
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" SERIAL NOT NULL,
    "purpose" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkHoursConfiguration" (
    "id" SERIAL NOT NULL,
    "workHoursModal" "workHoursModal" NOT NULL DEFAULT 'GENERAL_TIME_COVER',
    "startTime" TEXT NOT NULL DEFAULT '10:00',
    "endTime" TEXT NOT NULL DEFAULT '17:00',
    "workingDurationMinutesMin" INTEGER NOT NULL DEFAULT 60,
    "workingDurationMintesMax" INTEGER NOT NULL DEFAULT 480,
    "shiftTimes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weeklyOffDays" INTEGER[] DEFAULT ARRAY[6, 7]::INTEGER[],
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "WorkHoursConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticularDateConfig" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "ParticularDateConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PunchLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "punchIn" TIMESTAMP(3),
    "punchOut" TIMESTAMP(3),
    "remarks" "PunchLogType" NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "PunchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryDesign" (
    "id" SERIAL NOT NULL,
    "components" JSONB,
    "formulas" JSONB,
    "gross_vite_Amount" DOUBLE PRECISION NOT NULL,
    "total_vite_Deduction" DOUBLE PRECISION NOT NULL,
    "net_vite_Pay" DOUBLE PRECISION NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendanceDesignModal" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "attendanceDesignModal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanHistory_companyId_idx" ON "PlanHistory"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE INDEX "Role_companyId_idx" ON "Role"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_bankAccount_key" ON "BankDetails"("bankAccount");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_ifsc_key" ON "BankDetails"("ifsc");

-- CreateIndex
CREATE INDEX "BankDetails_companyId_idx" ON "BankDetails"("companyId");

-- CreateIndex
CREATE INDEX "WorkHoursConfiguration_companyId_idx" ON "WorkHoursConfiguration"("companyId");

-- CreateIndex
CREATE INDEX "ParticularDateConfig_companyId_idx" ON "ParticularDateConfig"("companyId");

-- CreateIndex
CREATE INDEX "PunchLog_userId_idx" ON "PunchLog"("userId");

-- CreateIndex
CREATE INDEX "PunchLog_companyId_idx" ON "PunchLog"("companyId");

-- CreateIndex
CREATE INDEX "SalaryDesign_companyId_idx" ON "SalaryDesign"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_empCode_key" ON "User"("empCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_adharNumber_key" ON "User"("adharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_uanNumber_key" ON "User"("uanNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- AddForeignKey
ALTER TABLE "PlanHistory" ADD CONSTRAINT "PlanHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_punchId_fkey" FOREIGN KEY ("punchId") REFERENCES "PunchLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkHoursConfiguration" ADD CONSTRAINT "WorkHoursConfiguration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticularDateConfig" ADD CONSTRAINT "ParticularDateConfig_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PunchLog" ADD CONSTRAINT "PunchLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryDesign" ADD CONSTRAINT "SalaryDesign_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

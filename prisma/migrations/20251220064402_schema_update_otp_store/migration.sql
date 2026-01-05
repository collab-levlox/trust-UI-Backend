/*
  Warnings:

  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `WorkHoursConfigurationId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `empCode` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobileNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pinCode` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `punchId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_punchId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "WorkHoursConfigurationId" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "companyId" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "empCode" SET NOT NULL,
ALTER COLUMN "mobileNumber" SET NOT NULL,
ALTER COLUMN "pinCode" SET NOT NULL,
ALTER COLUMN "punchId" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;

-- CreateTable
CREATE TABLE "OtpStroe" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OtpStroe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_punchId_fkey" FOREIGN KEY ("punchId") REFERENCES "PunchLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

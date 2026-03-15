/*
  Warnings:

  - Added the required column `serviceName` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceName" AS ENUM ('MEDIS', 'NON_MEDIS');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "serviceName" "ServiceName" NOT NULL;

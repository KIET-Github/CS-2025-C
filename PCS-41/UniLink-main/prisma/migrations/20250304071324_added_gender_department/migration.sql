/*
  Warnings:

  - You are about to drop the column `offerLetterUrl` on the `PlacementRecord` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PlacementRecord` table. All the data in the column will be lost.
  - You are about to drop the column `verificationFeedback` on the `PlacementRecord` table. All the data in the column will be lost.
  - Added the required column `department` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CS', 'IT', 'ME', 'EE', 'EC', 'CE');

-- AlterTable
ALTER TABLE "PlacementRecord" DROP COLUMN "offerLetterUrl",
DROP COLUMN "status",
DROP COLUMN "verificationFeedback";

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "department" "Department" NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;

-- DropEnum
DROP TYPE "PlacementStatus";

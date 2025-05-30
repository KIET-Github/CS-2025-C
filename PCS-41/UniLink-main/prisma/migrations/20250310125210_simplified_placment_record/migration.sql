/*
  Warnings:

  - You are about to drop the column `joiningDate` on the `PlacementRecord` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `PlacementRecord` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `PlacementRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlacementRecord" DROP COLUMN "joiningDate",
DROP COLUMN "position",
DROP COLUMN "salary";

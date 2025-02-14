/*
  Warnings:

  - Made the column `ukuran` on table `pesanan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pesanan` MODIFY `ukuran` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - Added the required column `jenis` to the `pesanan` table without a default value. This is not possible if the table is not empty.
  - Made the column `jumlah` on table `pesanan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pesanan` ADD COLUMN `jenis` VARCHAR(191) NOT NULL,
    ADD COLUMN `ukuran` INTEGER NULL,
    MODIFY `jumlah` INTEGER NOT NULL;

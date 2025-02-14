/*
  Warnings:

  - Added the required column `alias` to the `bahan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenis` to the `bahan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode_bahan` to the `bahan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `satuan` to the `bahan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bahan` ADD COLUMN `alias` VARCHAR(191) NOT NULL,
    ADD COLUMN `jenis` VARCHAR(191) NOT NULL,
    ADD COLUMN `kode_bahan` VARCHAR(191) NOT NULL,
    ADD COLUMN `satuan` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `kota` (
    `id_kota` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kota` VARCHAR(191) NOT NULL,
    `provinsi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_kota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

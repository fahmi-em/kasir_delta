-- CreateTable
CREATE TABLE `customer` (
    `nik` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `kota` VARCHAR(191) NOT NULL,
    `provinsi` VARCHAR(191) NOT NULL,
    `kode_pos` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bahan` (
    `id_bahan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_bahan` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_bahan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id_pesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` VARCHAR(191) NOT NULL,
    `id_bahan` INTEGER NOT NULL,
    `nama_bahan` VARCHAR(191) NOT NULL,
    `harga_bahan` INTEGER NOT NULL,
    `jumlah` INTEGER NULL,
    `Panjang` INTEGER NULL,
    `Lebar` INTEGER NULL,
    `total_harga` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'save') NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id_pesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`nik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_bahan_fkey` FOREIGN KEY (`id_bahan`) REFERENCES `bahan`(`id_bahan`) ON DELETE RESTRICT ON UPDATE CASCADE;

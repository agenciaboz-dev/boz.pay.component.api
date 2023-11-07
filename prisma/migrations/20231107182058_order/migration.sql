/*
  Warnings:

  - You are about to drop the column `address_1` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `address_2` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `cart_hash` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `date_modified` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_key` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pag_status` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `address_1` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `address_2` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Shipping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalDataId]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personalDataId]` on the table `Shipping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Shipping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalDataId` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreated` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateModified` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalDataId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Billing` DROP COLUMN `address_1`,
    DROP COLUMN `address_2`,
    DROP COLUMN `city`,
    DROP COLUMN `company`,
    DROP COLUMN `country`,
    DROP COLUMN `email`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `phone`,
    DROP COLUMN `postcode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `personalDataId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `cart_hash`,
    DROP COLUMN `customer_id`,
    DROP COLUMN `date_created`,
    DROP COLUMN `date_modified`,
    DROP COLUMN `order_key`,
    DROP COLUMN `pag_status`,
    ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD COLUMN `dateCreated` VARCHAR(191) NOT NULL,
    ADD COLUMN `dateModified` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `store` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Shipping` DROP COLUMN `address_1`,
    DROP COLUMN `address_2`,
    DROP COLUMN `city`,
    DROP COLUMN `company`,
    DROP COLUMN `country`,
    DROP COLUMN `cpf`,
    DROP COLUMN `district`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `number`,
    DROP COLUMN `phone`,
    DROP COLUMN `postcode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `personalDataId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postcode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Billing_personalDataId_key` ON `Billing`(`personalDataId`);

-- CreateIndex
CREATE UNIQUE INDEX `Billing_addressId_key` ON `Billing`(`addressId`);

-- CreateIndex
CREATE UNIQUE INDEX `Shipping_personalDataId_key` ON `Shipping`(`personalDataId`);

-- CreateIndex
CREATE UNIQUE INDEX `Shipping_addressId_key` ON `Shipping`(`addressId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_billing_id_fkey` FOREIGN KEY (`billing_id`) REFERENCES `Billing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `Shipping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_personalDataId_fkey` FOREIGN KEY (`personalDataId`) REFERENCES `PersonalData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_personalDataId_fkey` FOREIGN KEY (`personalDataId`) REFERENCES `PersonalData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

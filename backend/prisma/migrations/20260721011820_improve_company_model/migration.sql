/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "city" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "manager" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "code" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "city" TEXT,
ADD COLUMN     "fantasyName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "rut" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "internalCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'UN';

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "rut" TEXT,
ADD COLUMN     "website" TEXT;

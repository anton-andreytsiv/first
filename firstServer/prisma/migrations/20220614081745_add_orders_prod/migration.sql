/*
  Warnings:

  - You are about to drop the column `order` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "order";

-- CreateTable
CREATE TABLE "ProductsInOrder" (
    "id" SERIAL NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "idOrder" INTEGER NOT NULL,

    CONSTRAINT "ProductsInOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductsInOrder" ADD CONSTRAINT "ProductsInOrder_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsInOrder" ADD CONSTRAINT "ProductsInOrder_idOrder_fkey" FOREIGN KEY ("idOrder") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

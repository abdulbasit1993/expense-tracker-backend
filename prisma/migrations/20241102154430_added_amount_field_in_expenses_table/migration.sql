/*
  Warnings:

  - Added the required column `total_amount` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense" ADD COLUMN     "total_amount" INTEGER NOT NULL;

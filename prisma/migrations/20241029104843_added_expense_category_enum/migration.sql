/*
  Warnings:

  - You are about to drop the column `created_by` on the `expense_category` table. All the data in the column will be lost.
  - Changed the type of `name` on the `expense_category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExpenseCategoryEnum" AS ENUM ('Housing', 'HealthAndWellness', 'Food', 'Transportation', 'Insurance', 'Education', 'Entertainment', 'Clothing', 'SavingsAndInvestments', 'Other');

-- DropForeignKey
ALTER TABLE "expense_category" DROP CONSTRAINT "expense_category_created_by_fkey";

-- AlterTable
ALTER TABLE "expense_category" DROP COLUMN "created_by",
DROP COLUMN "name",
ADD COLUMN     "name" "ExpenseCategoryEnum" NOT NULL;

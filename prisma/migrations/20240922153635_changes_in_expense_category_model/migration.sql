/*
  Warnings:

  - Added the required column `created_by` to the `expense_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense_category" ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "expense_category" ADD CONSTRAINT "expense_category_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "IncomeCategoryEnum" AS ENUM ('Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Pension', 'GovernmentBenefits', 'Gift', 'Bonus', 'Lottery', 'Other');

-- CreateTable
CREATE TABLE "income_source" (
    "id" SERIAL NOT NULL,
    "name" "IncomeCategoryEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "income_source_pkey" PRIMARY KEY ("id")
);

import {
  PrismaClient,
  RoleEnum,
  ExpenseCategoryEnum,
  IncomeCategoryEnum,
} from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = [RoleEnum.USER, RoleEnum.ADMIN];

  const expenseCategories = [
    ExpenseCategoryEnum.Clothing,
    ExpenseCategoryEnum.Education,
    ExpenseCategoryEnum.Entertainment,
    ExpenseCategoryEnum.Food,
    ExpenseCategoryEnum.HealthAndWellness,
    ExpenseCategoryEnum.Housing,
    ExpenseCategoryEnum.Insurance,
    ExpenseCategoryEnum.SavingsAndInvestments,
    ExpenseCategoryEnum.Transportation,
    ExpenseCategoryEnum.Other,
  ];

  const incomeCategories = [
    IncomeCategoryEnum.Salary,
    IncomeCategoryEnum.Freelance,
    IncomeCategoryEnum.Business,
    IncomeCategoryEnum.Investment,
    IncomeCategoryEnum.Rental,
    IncomeCategoryEnum.Pension,
    IncomeCategoryEnum.GovernmentBenefits,
    IncomeCategoryEnum.Gift,
    IncomeCategoryEnum.Bonus,
    IncomeCategoryEnum.Lottery,
    IncomeCategoryEnum.Other,
  ];

  await prisma.roles.deleteMany();

  await Promise.all(
    roles.map((role) =>
      prisma.roles.create({
        data: { type: role },
      })
    )
  );

  await prisma.expenseCategory.deleteMany();

  await Promise.all(
    expenseCategories?.map((cat) =>
      prisma.expenseCategory.create({
        data: { name: cat },
      })
    )
  );

  await prisma.incomeSource.deleteMany();

  await Promise.all(
    incomeCategories?.map((cat) =>
      prisma.incomeSource.create({
        data: { name: cat },
      })
    )
  );
}

main()
  .then(async () => {
    console.log("Roles created on database successfully");
    console.log("Expense categories created on database successfully");
    console.log("Income source categories created on database successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log("Error: ", e);
    await prisma.$disconnect();
    process.exit(1);
  });

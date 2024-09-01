import { PrismaClient, RoleEnum } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = [RoleEnum.USER, RoleEnum.ADMIN];

  await prisma.roles.deleteMany();

  await Promise.all(
    roles.map((role) =>
      prisma.roles.create({
        data: { type: role },
      })
    )
  );
}

main()
  .then(async () => {
    console.log("Roles created on database successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log("Error: ", e);
    await prisma.$disconnect();
    process.exit(1);
  });

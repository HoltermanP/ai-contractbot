import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@contractbot.nl";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin";

  // Check of admin al bestaat
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin gebruiker bestaat al!");
    return;
  }

  // Hash wachtwoord
  const hashedPassword = await bcrypt.hash(password, 10);

  // Maak admin aan
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  console.log("Admin gebruiker aangemaakt:");
  console.log(`Email: ${admin.email}`);
  console.log(`Wachtwoord: ${password}`);
  console.log("⚠️  Verander het wachtwoord na eerste login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


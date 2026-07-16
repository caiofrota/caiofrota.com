import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    throw new Error('Uso: pnpm admin:create "Nome" email@exemplo.com senha-com-pelo-menos-12-caracteres');
  }
  if (password.length < 12) {
    throw new Error("A senha administrativa precisa ter pelo menos 12 caracteres.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);
  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { name: name.trim(), passwordHash, role: "ADMIN" },
    create: { name: name.trim(), email: normalizedEmail, passwordHash, role: "ADMIN" },
  });

  console.log(`Usuário administrador pronto: ${normalizedEmail}`);
}

void main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

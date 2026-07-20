import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '../src/generated/prisma/client';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import slugify from 'slugify';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string
});

const prisma = new PrismaClient({ adapter });
const passwordHasher = new PasswordHasher();

const devUsers = [
  { email: 'admin@libif.local', password: 'admin libif dev passphrase', role: UserRole.ADMIN },
  { email: 'librarian@libif.local', password: 'librarian libif dev passphrase', role: UserRole.LIBRARIAN },
  { email: 'reader@libif.local', password: 'reader libif dev passphrase', role: UserRole.READER }
];

async function main() {
  for (const user of devUsers) {
    const passwordHash = await passwordHasher.hash(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash, role: user.role },
      create: { email: user.email, passwordHash, role: user.role }
    });
  }

  for (const name of ['Giáo trình', 'Nghiên cứu', 'Văn học', 'Luận văn']) {
    await prisma.category.upsert({
      where: { slug: slugify(name, { lower: true, strict: true, locale: 'vi' }) },
      update: { name },
      create: { name, slug: slugify(name, { lower: true, strict: true, locale: 'vi' }) }
    });
  }
}

main()
  .finally(async () => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

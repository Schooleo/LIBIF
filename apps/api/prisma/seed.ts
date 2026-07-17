import { PrismaClient, UserRole } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@libif.local' },
    update: {},
    create: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN }
  });
  await prisma.user.upsert({
    where: { email: 'librarian@libif.local' },
    update: {},
    create: { email: 'librarian@libif.local', passwordHash: 'dev-only', role: UserRole.LIBRARIAN }
  });

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

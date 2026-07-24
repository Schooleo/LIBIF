import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ProcessingArtifactKind } from '../src/generated/prisma/client';
import { StorageService } from '../src/modules/storage/storage.service';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const storage = new StorageService(new ConfigService(process.env));
  const artifacts = await prisma.processingArtifact.findMany({
    where: {
      kind: ProcessingArtifactKind.EXTRACTED_TEXT,
      bookFile: { status: 'ACTIVE' },
    },
    include: {
      bookFile: { select: { bookId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const latestArtifactByBook = new Map<string, (typeof artifacts)[number]>();
  for (const artifact of artifacts) {
    if (!latestArtifactByBook.has(artifact.bookFile.bookId)) {
      latestArtifactByBook.set(artifact.bookFile.bookId, artifact);
    }
  }

  let indexed = 0;
  for (const artifact of latestArtifactByBook.values()) {
    const content = await storage.getObjectBuffer(artifact.bucket, artifact.objectKey);
    await prisma.book.update({
      where: { id: artifact.bookFile.bookId },
      data: { searchText: content.toString('utf8') },
    });
    indexed += 1;
  }

  console.log(`Indexed processed text for ${indexed} document${indexed === 1 ? '' : 's'}.`);
}

main()
  .finally(async () => prisma.$disconnect())
  .catch((error) => {
    console.error('Failed to backfill the catalogue search index.', error);
    process.exit(1);
  });

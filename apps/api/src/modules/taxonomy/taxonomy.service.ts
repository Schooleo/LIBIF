import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaxonomyCategoryDto } from './dto/category.dto';
import { TaxonomyTagDto } from './dto/tag.dto';

@Injectable()
export class TaxonomyService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  listCategories(): Promise<TaxonomyCategoryDto[]> {
    return this.prisma.category.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true, parentId: true }
    });
  }

  listTags(): Promise<TaxonomyTagDto[]> {
    return this.prisma.tag.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true }
    });
  }
}

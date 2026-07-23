import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../database/prisma.service';
import { CreateTaxonomyCategoryDto, TaxonomyCategoryDto, UpdateTaxonomyCategoryDto } from './dto/category.dto';
import { CreateTaxonomyTagDto, TaxonomyTagDto, UpdateTaxonomyTagDto } from './dto/tag.dto';

const categorySelect = { id: true, name: true, slug: true, parentId: true } as const;
const tagSelect = { id: true, name: true, slug: true } as const;

@Injectable()
export class TaxonomyService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  listCategories(): Promise<TaxonomyCategoryDto[]> {
    return this.prisma.category.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: categorySelect
    });
  }

  listTags(): Promise<TaxonomyTagDto[]> {
    return this.prisma.tag.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: tagSelect
    });
  }

  async createCategory(dto: CreateTaxonomyCategoryDto): Promise<TaxonomyCategoryDto> {
    const name = normalizedName(dto.name);
    const parentId = normalizedParentId(dto.parentId);
    await this.assertValidCategoryParent(undefined, parentId);

    try {
      return await this.prisma.category.create({ data: { name, slug: normalizedSlug(name), parentId }, select: categorySelect });
    } catch (error) {
      this.rethrowSlugConflict(error, 'Category');
    }
  }

  async updateCategory(id: string, dto: UpdateTaxonomyCategoryDto): Promise<TaxonomyCategoryDto> {
    const current = await this.prisma.category.findUnique({ where: { id }, select: categorySelect });
    if (!current) throw new NotFoundException('Category not found.');
    if (dto.name === undefined && dto.parentId === undefined) throw new BadRequestException('At least one category field is required.');

    const name = dto.name === undefined ? undefined : normalizedName(dto.name);
    const parentId = dto.parentId === undefined ? undefined : normalizedParentId(dto.parentId);
    if (parentId !== undefined) await this.assertValidCategoryParent(id, parentId);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: { ...(name === undefined ? {} : { name, slug: normalizedSlug(name) }), ...(parentId === undefined ? {} : { parentId }) },
        select: categorySelect
      });
    } catch (error) {
      this.rethrowSlugConflict(error, 'Category');
    }
  }

  async createTag(dto: CreateTaxonomyTagDto): Promise<TaxonomyTagDto> {
    const name = normalizedName(dto.name);
    try {
      return await this.prisma.tag.create({ data: { name, slug: normalizedSlug(name) }, select: tagSelect });
    } catch (error) {
      this.rethrowSlugConflict(error, 'Tag');
    }
  }

  async updateTag(id: string, dto: UpdateTaxonomyTagDto): Promise<TaxonomyTagDto> {
    const current = await this.prisma.tag.findUnique({ where: { id }, select: tagSelect });
    if (!current) throw new NotFoundException('Tag not found.');
    if (dto.name === undefined) throw new BadRequestException('Tag name is required.');

    const name = normalizedName(dto.name);
    try {
      return await this.prisma.tag.update({ where: { id }, data: { name, slug: normalizedSlug(name) }, select: tagSelect });
    } catch (error) {
      this.rethrowSlugConflict(error, 'Tag');
    }
  }

  async getCategoryImpact(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!category) throw new NotFoundException('Category not found.');

    const documentCount = await this.prisma.book.count({ where: { categoryId: id } });
    const childCount = await this.prisma.category.count({ where: { parentId: id } });
    const descendants = await this.getDescendantCategoryIds(id);
    const totalDescendantCount = descendants.size;
    const isLeaf = childCount === 0;
    const canDirectDelete = documentCount === 0 && childCount === 0;

    return {
      id: category.id,
      name: category.name,
      documentCount,
      childCount,
      totalDescendantCount,
      isLeaf,
      canDirectDelete,
    };
  }

  async reassignAndDeleteCategory(id: string, dto?: { targetCategoryId?: string | null }) {
    const category = await this.prisma.category.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!category) throw new NotFoundException('Category not found.');

    const documentCount = await this.prisma.book.count({ where: { categoryId: id } });
    const childCount = await this.prisma.category.count({ where: { parentId: id } });
    const targetCategoryId = dto?.targetCategoryId ? dto.targetCategoryId.trim() : null;

    if (documentCount > 0 || childCount > 0) {
      if (!targetCategoryId) {
        throw new BadRequestException('Reassignment target category is required before deleting a category with associated documents or subcategories.');
      }
    }

    if (targetCategoryId) {
      if (targetCategoryId === id) {
        throw new BadRequestException('Target category cannot be the category being deleted.');
      }
      const targetCategory = await this.prisma.category.findUnique({ where: { id: targetCategoryId }, select: { id: true } });
      if (!targetCategory) {
        throw new NotFoundException('Reassignment target category not found.');
      }
      const descendants = await this.getDescendantCategoryIds(id);
      if (descendants.has(targetCategoryId)) {
        throw new BadRequestException('Reassignment target category cannot be a child or descendant of the category being deleted.');
      }
    }

    await this.prisma.$transaction(async (tx) => {
      if (targetCategoryId) {
        await tx.book.updateMany({
          where: { categoryId: id },
          data: { categoryId: targetCategoryId },
        });
        await tx.category.updateMany({
          where: { parentId: id },
          data: { parentId: targetCategoryId },
        });
      }
      await tx.category.delete({ where: { id } });
    });

    return {
      success: true,
      deletedCategoryId: id,
      reassignedToCategoryId: targetCategoryId,
    };
  }

  async getTagImpact(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!tag) throw new NotFoundException('Tag not found.');

    const documentCount = await this.prisma.bookTag.count({ where: { tagId: id } });

    return {
      id: tag.id,
      name: tag.name,
      documentCount,
    };
  }

  async deleteTag(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id }, select: { id: true } });
    if (!tag) throw new NotFoundException('Tag not found.');

    await this.prisma.$transaction(async (tx) => {
      await tx.bookTag.deleteMany({ where: { tagId: id } });
      await tx.tag.delete({ where: { id } });
    });

    return { success: true, deletedTagId: id };
  }

  async mergeTag(sourceTagId: string, dto: { targetTagId: string }) {
    const sourceTag = await this.prisma.tag.findUnique({ where: { id: sourceTagId }, select: { id: true } });
    if (!sourceTag) throw new NotFoundException('Source tag not found.');

    const targetTagId = dto.targetTagId.trim();
    if (targetTagId === sourceTagId) {
      throw new BadRequestException('Target tag cannot be the source tag being merged.');
    }

    const targetTag = await this.prisma.tag.findUnique({ where: { id: targetTagId }, select: { id: true } });
    if (!targetTag) throw new NotFoundException('Target tag not found.');

    await this.prisma.$transaction(async (tx) => {
      const sourceBookTags = await tx.bookTag.findMany({ where: { tagId: sourceTagId }, select: { bookId: true } });
      const targetBookTags = await tx.bookTag.findMany({ where: { tagId: targetTagId }, select: { bookId: true } });
      const existingTargetBookIds = new Set(targetBookTags.map((bt) => bt.bookId));

      const bookIdsToAdd = sourceBookTags.map((bt) => bt.bookId).filter((bookId) => !existingTargetBookIds.has(bookId));

      if (bookIdsToAdd.length > 0) {
        await tx.bookTag.createMany({
          data: bookIdsToAdd.map((bookId) => ({ bookId, tagId: targetTagId })),
        });
      }

      await tx.bookTag.deleteMany({ where: { tagId: sourceTagId } });
      await tx.tag.delete({ where: { id: sourceTagId } });
    });

    return {
      success: true,
      mergedTagId: sourceTagId,
      targetTagId,
    };
  }

  private async getDescendantCategoryIds(categoryId: string): Promise<Set<string>> {
    const descendants = new Set<string>();
    const queue = [categoryId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = await this.prisma.category.findMany({
        where: { parentId: currentId },
        select: { id: true },
      });
      for (const child of children) {
        if (!descendants.has(child.id)) {
          descendants.add(child.id);
          queue.push(child.id);
        }
      }
    }

    return descendants;
  }


  private async assertValidCategoryParent(categoryId: string | undefined, parentId: string | null): Promise<void> {
    const visited = new Set<string>();
    let cursorId = parentId;

    while (cursorId) {
      if (cursorId === categoryId || visited.has(cursorId)) throw new BadRequestException('Category parent would create a cycle.');
      visited.add(cursorId);
      const cursor = await this.prisma.category.findUnique({ where: { id: cursorId }, select: { id: true, parentId: true } });
      if (!cursor) throw new BadRequestException('Selected parent category does not exist.');
      cursorId = cursor.parentId;
    }
  }

  private rethrowSlugConflict(error: unknown, resource: 'Category' | 'Tag'): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException(`${resource} slug already exists.`);
    }
    throw error;
  }
}

function normalizedName(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) throw new BadRequestException('Name is required.');
  return normalized;
}

function normalizedParentId(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function normalizedSlug(name: string): string {
  const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
  if (!slug) throw new BadRequestException('Name must contain characters that can form a slug.');
  return slug;
}

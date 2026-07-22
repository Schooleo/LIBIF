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

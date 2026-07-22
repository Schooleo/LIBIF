import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { AdminCategoriesController, CategoriesController } from './categories.controller';
import { AdminTagsController, TagsController } from './tags.controller';
import { TaxonomyService } from './taxonomy.service';

describe('TaxonomyService', () => {
  let service: TaxonomyService;
  let categories: CategoriesController;
  let adminCategories: AdminCategoriesController;
  let tags: TagsController;
  let adminTags: AdminTagsController;
  let prisma: {
    category: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
    tag: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      category: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      tag: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() }
    };
    service = new TaxonomyService(prisma as never);
    categories = new CategoriesController(service);
    adminCategories = new AdminCategoriesController(service);
    tags = new TagsController(service);
    adminTags = new AdminTagsController(service);
  });

  it('returns stable category option fields in deterministic order', async () => {
    const records = [{ id: 'category-1', name: 'Archives', slug: 'archives', parentId: null }];
    prisma.category.findMany.mockResolvedValue(records);

    await expect(service.listCategories()).resolves.toEqual(records);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true, parentId: true }
    });
  });

  it('returns stable tag option fields in deterministic order', async () => {
    const records = [{ id: 'tag-1', name: 'Digital', slug: 'digital' }];
    prisma.tag.findMany.mockResolvedValue(records);

    await expect(service.listTags()).resolves.toEqual(records);
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true }
    });
  });

  it('normalizes category names and slugs and validates the parent chain when creating', async () => {
    const created = { id: 'category-2', name: 'Hồ Sơ Số', slug: 'ho-so-so', parentId: 'category-1' };
    prisma.category.findUnique.mockResolvedValue({ id: 'category-1', parentId: null });
    prisma.category.create.mockResolvedValue(created);

    await expect(service.createCategory({ name: '  Hồ   Sơ Số  ', parentId: ' category-1 ' })).resolves.toEqual(created);
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: { name: 'Hồ Sơ Số', slug: 'ho-so-so', parentId: 'category-1' },
      select: { id: true, name: true, slug: true, parentId: true }
    });
  });

  it('rejects an unknown category parent', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.createCategory({ name: 'Archives', parentId: 'missing' })).rejects.toThrow('Selected parent category does not exist.');
    expect(prisma.category.create).not.toHaveBeenCalled();
  });

  it('rejects self and descendant category cycles', async () => {
    const root = { id: 'root', name: 'Root', slug: 'root', parentId: null };
    prisma.category.findUnique.mockResolvedValueOnce(root);

    await expect(service.updateCategory('root', { parentId: 'root' })).rejects.toBeInstanceOf(BadRequestException);

    prisma.category.findUnique.mockReset();
    prisma.category.findUnique.mockResolvedValueOnce(root).mockResolvedValueOnce({ id: 'child', parentId: 'root' });

    await expect(service.updateCategory('root', { parentId: 'child' })).rejects.toThrow('Category parent would create a cycle.');
    expect(prisma.category.update).not.toHaveBeenCalled();
  });

  it('normalizes category edits and supports moving a category to the root', async () => {
    const current = { id: 'category-2', name: 'Old', slug: 'old', parentId: 'category-1' };
    const updated = { id: 'category-2', name: 'New Archive', slug: 'new-archive', parentId: null };
    prisma.category.findUnique.mockResolvedValue(current);
    prisma.category.update.mockResolvedValue(updated);

    await expect(service.updateCategory('category-2', { name: ' New   Archive ', parentId: null })).resolves.toEqual(updated);
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'category-2' },
      data: { name: 'New Archive', slug: 'new-archive', parentId: null },
      select: { id: true, name: true, slug: true, parentId: true }
    });
  });

  it('normalizes tag create and edit operations', async () => {
    const created = { id: 'tag-1', name: 'Tài Liệu Số', slug: 'tai-lieu-so' };
    const updated = { id: 'tag-1', name: 'Digital Archive', slug: 'digital-archive' };
    prisma.tag.create.mockResolvedValue(created);
    prisma.tag.findUnique.mockResolvedValue(created);
    prisma.tag.update.mockResolvedValue(updated);

    await expect(service.createTag({ name: '  Tài   Liệu Số ' })).resolves.toEqual(created);
    await expect(service.updateTag('tag-1', { name: ' Digital   Archive ' })).resolves.toEqual(updated);
    expect(prisma.tag.create).toHaveBeenCalledWith({ data: { name: 'Tài Liệu Số', slug: 'tai-lieu-so' }, select: { id: true, name: true, slug: true } });
    expect(prisma.tag.update).toHaveBeenCalledWith({
      where: { id: 'tag-1' },
      data: { name: 'Digital Archive', slug: 'digital-archive' },
      select: { id: true, name: true, slug: true }
    });
  });

  it('returns safe conflicts for duplicate category and tag slugs', async () => {
    const conflict = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on slug', { code: 'P2002', clientVersion: '7.8.0' });
    prisma.category.create.mockRejectedValue(conflict);
    prisma.tag.create.mockRejectedValue(conflict);

    await expect(service.createCategory({ name: 'Archives' })).rejects.toEqual(expect.objectContaining<Partial<ConflictException>>({ message: 'Category slug already exists.' }));
    await expect(service.createTag({ name: 'Archives' })).rejects.toEqual(expect.objectContaining<Partial<ConflictException>>({ message: 'Tag slug already exists.' }));
  });

  it('rejects edits for missing records or empty patch bodies', async () => {
    prisma.category.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'category-1', name: 'Archive', slug: 'archive', parentId: null });
    prisma.tag.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'tag-1', name: 'Digital', slug: 'digital' });

    await expect(service.updateCategory('missing', { name: 'Archive' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.updateCategory('category-1', {})).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.updateTag('missing', { name: 'Digital' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.updateTag('tag-1', {})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('delegates read and mutation controllers to the taxonomy service', async () => {
    const categoryRecord = { id: 'category-1', name: 'Archives', slug: 'archives', parentId: null };
    const tagRecord = { id: 'tag-1', name: 'Digital', slug: 'digital' };
    jest.spyOn(service, 'listCategories').mockResolvedValue([categoryRecord]);
    jest.spyOn(service, 'listTags').mockResolvedValue([tagRecord]);
    jest.spyOn(service, 'createCategory').mockResolvedValue(categoryRecord);
    jest.spyOn(service, 'updateCategory').mockResolvedValue(categoryRecord);
    jest.spyOn(service, 'createTag').mockResolvedValue(tagRecord);
    jest.spyOn(service, 'updateTag').mockResolvedValue(tagRecord);

    await expect(categories.listCategories()).resolves.toEqual([categoryRecord]);
    await expect(tags.listTags()).resolves.toEqual([tagRecord]);
    await expect(adminCategories.createCategory({ name: 'Archives' })).resolves.toEqual(categoryRecord);
    await expect(adminCategories.updateCategory('category-1', { parentId: null })).resolves.toEqual(categoryRecord);
    await expect(adminTags.createTag({ name: 'Digital' })).resolves.toEqual(tagRecord);
    await expect(adminTags.updateTag('tag-1', { name: 'Digital' })).resolves.toEqual(tagRecord);
  });
});

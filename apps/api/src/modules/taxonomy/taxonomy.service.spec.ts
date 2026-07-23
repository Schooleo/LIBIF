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
    category: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; count: jest.Mock; updateMany: jest.Mock; delete: jest.Mock };
    tag: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
    book: { count: jest.Mock; updateMany: jest.Mock };
    bookTag: { count: jest.Mock; findMany: jest.Mock; createMany: jest.Mock; deleteMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      category: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), updateMany: jest.fn(), delete: jest.fn() },
      tag: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
      book: { count: jest.fn(), updateMany: jest.fn() },
      bookTag: { count: jest.fn(), findMany: jest.fn(), createMany: jest.fn(), deleteMany: jest.fn() },
      $transaction: jest.fn((callback: (tx: typeof prisma) => unknown) => callback(prisma)),
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

  it('calculates category deletion and reassignment impact metrics', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'History' });
    prisma.book.count.mockResolvedValue(5);
    prisma.category.count.mockResolvedValue(2);
    prisma.category.findMany.mockResolvedValueOnce([{ id: 'cat-2' }, { id: 'cat-3' }]).mockResolvedValue([]);

    const impact = await service.getCategoryImpact('cat-1');
    expect(impact).toEqual({
      id: 'cat-1',
      name: 'History',
      documentCount: 5,
      childCount: 2,
      totalDescendantCount: 2,
      isLeaf: false,
      canDirectDelete: false,
    });
  });

  it('requires a target category before deleting a category with associated documents or subcategories', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'History' });
    prisma.book.count.mockResolvedValue(3);
    prisma.category.count.mockResolvedValue(0);

    await expect(service.reassignAndDeleteCategory('cat-1')).rejects.toThrow('Reassignment target category is required before deleting a category with associated documents or subcategories.');
  });

  it('atomically reassigns documents and child categories before deleting a category', async () => {
    prisma.category.findUnique
      .mockResolvedValueOnce({ id: 'cat-1', name: 'Source Cat' })
      .mockResolvedValueOnce({ id: 'target-cat', name: 'Target Cat' });
    prisma.book.count.mockResolvedValue(2);
    prisma.category.count.mockResolvedValue(1);
    prisma.category.findMany.mockResolvedValue([]);
    prisma.book.updateMany.mockResolvedValue({ count: 2 });
    prisma.category.updateMany.mockResolvedValue({ count: 1 });
    prisma.category.delete.mockResolvedValue({ id: 'cat-1' });

    const result = await service.reassignAndDeleteCategory('cat-1', { targetCategoryId: 'target-cat' });
    expect(result).toEqual({
      success: true,
      deletedCategoryId: 'cat-1',
      reassignedToCategoryId: 'target-cat',
    });
    expect(prisma.book.updateMany).toHaveBeenCalledWith({ where: { categoryId: 'cat-1' }, data: { categoryId: 'target-cat' } });
    expect(prisma.category.updateMany).toHaveBeenCalledWith({ where: { parentId: 'cat-1' }, data: { parentId: 'target-cat' } });
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
  });

  it('rejects self and descendant reassignment targets', async () => {
    prisma.category.findUnique
      .mockResolvedValueOnce({ id: 'cat-1', name: 'Parent' })
      .mockResolvedValueOnce({ id: 'cat-1', name: 'Parent' });
    prisma.book.count.mockResolvedValue(1);
    prisma.category.count.mockResolvedValue(0);

    await expect(service.reassignAndDeleteCategory('cat-1', { targetCategoryId: 'cat-1' })).rejects.toThrow('Target category cannot be the category being deleted.');

    prisma.category.findUnique.mockReset();
    prisma.category.findUnique
      .mockResolvedValueOnce({ id: 'cat-1', name: 'Parent' })
      .mockResolvedValueOnce({ id: 'child-1', name: 'Child' });
    prisma.category.findMany.mockResolvedValueOnce([{ id: 'child-1' }]).mockResolvedValue([]);

    await expect(service.reassignAndDeleteCategory('cat-1', { targetCategoryId: 'child-1' })).rejects.toThrow('Reassignment target category cannot be a child or descendant of the category being deleted.');
  });

  it('calculates tag impact and deletes tag safely', async () => {
    prisma.tag.findUnique.mockResolvedValue({ id: 'tag-1', name: 'Digital' });
    prisma.bookTag.count.mockResolvedValue(4);

    const impact = await service.getTagImpact('tag-1');
    expect(impact).toEqual({ id: 'tag-1', name: 'Digital', documentCount: 4 });

    prisma.bookTag.deleteMany.mockResolvedValue({ count: 4 });
    prisma.tag.delete.mockResolvedValue({ id: 'tag-1' });

    const deleteResult = await service.deleteTag('tag-1');
    expect(deleteResult).toEqual({ success: true, deletedTagId: 'tag-1' });
    expect(prisma.bookTag.deleteMany).toHaveBeenCalledWith({ where: { tagId: 'tag-1' } });
    expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: 'tag-1' } });
  });

  it('merges source tag into target tag without duplicate document tag entries', async () => {
    prisma.tag.findUnique
      .mockResolvedValueOnce({ id: 'tag-source', name: 'Source' })
      .mockResolvedValueOnce({ id: 'tag-target', name: 'Target' });

    prisma.bookTag.findMany
      .mockResolvedValueOnce([{ bookId: 'book-1' }, { bookId: 'book-2' }])
      .mockResolvedValueOnce([{ bookId: 'book-2' }]);
    prisma.bookTag.createMany.mockResolvedValue({ count: 1 });
    prisma.bookTag.deleteMany.mockResolvedValue({ count: 2 });
    prisma.tag.delete.mockResolvedValue({ id: 'tag-source' });

    const mergeResult = await service.mergeTag('tag-source', { targetTagId: 'tag-target' });
    expect(mergeResult).toEqual({
      success: true,
      mergedTagId: 'tag-source',
      targetTagId: 'tag-target',
    });
    expect(prisma.bookTag.createMany).toHaveBeenCalledWith({
      data: [{ bookId: 'book-1', tagId: 'tag-target' }],
    });
    expect(prisma.bookTag.deleteMany).toHaveBeenCalledWith({ where: { tagId: 'tag-source' } });
    expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: 'tag-source' } });
  });
});


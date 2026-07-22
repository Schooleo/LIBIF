import { CategoriesController } from './categories.controller';
import { TagsController } from './tags.controller';
import { TaxonomyService } from './taxonomy.service';

describe('TaxonomyService', () => {
  let service: TaxonomyService;
  let categories: CategoriesController;
  let tags: TagsController;
  let prisma: {
    category: { findMany: jest.Mock };
    tag: { findMany: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      category: { findMany: jest.fn() },
      tag: { findMany: jest.fn() }
    };
    service = new TaxonomyService(prisma as never);
    categories = new CategoriesController(service);
    tags = new TagsController(service);
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

  it('delegates category and tag controllers to the taxonomy service', async () => {
    const categoryRecords = [{ id: 'category-1', name: 'Archives', slug: 'archives', parentId: null }];
    const tagRecords = [{ id: 'tag-1', name: 'Digital', slug: 'digital' }];
    prisma.category.findMany.mockResolvedValue(categoryRecords);
    prisma.tag.findMany.mockResolvedValue(tagRecords);

    await expect(categories.listCategories()).resolves.toEqual(categoryRecords);
    await expect(tags.listTags()).resolves.toEqual(tagRecords);
  });
});

import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CategoryResponseDto, PagedPublicBookListResponseDto, PublicBookDetailResponseDto, TagResponseDto } from './dto/catalog-response.dto';
import { CatalogQueryDto } from './dto/catalog-query.dto';

@ApiTags('Catalog')
@Controller()
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List public category options.' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: 'List public tag options.' })
  @ApiOkResponse({ type: [TagResponseDto] })
  listTags() {
    return this.catalog.listTags();
  }

  @Get('catalog/books')
  @ApiOperation({ summary: 'List published public catalogue books.' })
  @ApiOkResponse({ type: PagedPublicBookListResponseDto })
  listPublicBooks(@Query() query: CatalogQueryDto) {
    return this.catalog.listPublicBooks(query);
  }

  @Get('catalog/books/:documentId')
  @ApiOperation({ summary: 'Get published public catalogue book detail.' })
  @ApiOkResponse({ type: PublicBookDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Book not found or not published.' })
  getPublicBookDetail(@Param('documentId') documentId: string) {
    return this.catalog.getPublicBookDetail(documentId);
  }
}

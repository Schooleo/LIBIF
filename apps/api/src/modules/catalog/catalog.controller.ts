import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { BookListItemResponseDto, CategoryResponseDto } from './dto/catalog-response.dto';

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

  @Get('catalog/books')
  @ApiOperation({ summary: 'List published public catalogue books.' })
  @ApiOkResponse({ type: [BookListItemResponseDto] })
  listPublicBooks() {
    return this.catalog.listPublicBooks();
  }
}

import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TaxonomyCategoryDto } from './dto/category.dto';
import { TaxonomyService } from './taxonomy.service';

@ApiTags('Taxonomy')
@Controller('taxonomy/categories')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class CategoriesController {
  constructor(@Inject(TaxonomyService) private readonly taxonomy: TaxonomyService) {}

  @Get()
  @ApiOperation({ summary: 'List category options for staff document metadata.' })
  @ApiOkResponse({ type: [TaxonomyCategoryDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  listCategories(): Promise<TaxonomyCategoryDto[]> {
    return this.taxonomy.listCategories();
  }
}

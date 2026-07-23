import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTaxonomyCategoryDto, ReassignAndDeleteCategoryDto, TaxonomyCategoryDto, TaxonomyCategoryImpactDto, UpdateTaxonomyCategoryDto } from './dto/category.dto';
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

  @Get(':id/impact')
  @ApiOperation({ summary: 'Get category deletion and reassignment impact metrics.' })
  @ApiOkResponse({ type: TaxonomyCategoryImpactDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  getCategoryImpact(@Param('id') id: string): Promise<TaxonomyCategoryImpactDto> {
    return this.taxonomy.getCategoryImpact(id);
  }
}

@ApiTags('Admin Taxonomy')
@Controller('admin/categories')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminCategoriesController {
  constructor(@Inject(TaxonomyService) private readonly taxonomy: TaxonomyService) {}

  @Get(':id/impact')
  @ApiOperation({ summary: 'Get category deletion and reassignment impact metrics.' })
  @ApiOkResponse({ type: TaxonomyCategoryImpactDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  getCategoryImpact(@Param('id') id: string): Promise<TaxonomyCategoryImpactDto> {
    return this.taxonomy.getCategoryImpact(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a category.' })
  @ApiCreatedResponse({ type: TaxonomyCategoryDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  createCategory(@Body() dto: CreateTaxonomyCategoryDto): Promise<TaxonomyCategoryDto> {
    return this.taxonomy.createCategory(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit a category name or parent.' })
  @ApiOkResponse({ type: TaxonomyCategoryDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateTaxonomyCategoryDto): Promise<TaxonomyCategoryDto> {
    return this.taxonomy.updateCategory(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category safely or reassign its contents before deletion.' })
  @ApiOkResponse({ description: 'Category deleted successfully.' })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  deleteCategory(@Param('id') id: string, @Query('targetCategoryId') targetCategoryId?: string, @Body() dto?: ReassignAndDeleteCategoryDto) {
    const target = dto?.targetCategoryId || targetCategoryId;
    return this.taxonomy.reassignAndDeleteCategory(id, { targetCategoryId: target });
  }

  @Post(':id/reassign-and-delete')
  @ApiOperation({ summary: 'Reassign associated documents and subcategories then delete category.' })
  @ApiOkResponse({ description: 'Category contents reassigned and category deleted.' })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  reassignAndDeleteCategory(@Param('id') id: string, @Body() dto: ReassignAndDeleteCategoryDto) {
    return this.taxonomy.reassignAndDeleteCategory(id, dto);
  }
}


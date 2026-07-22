import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTaxonomyCategoryDto, TaxonomyCategoryDto, UpdateTaxonomyCategoryDto } from './dto/category.dto';
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

@ApiTags('Admin Taxonomy')
@Controller('admin/categories')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminCategoriesController {
  constructor(@Inject(TaxonomyService) private readonly taxonomy: TaxonomyService) {}

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
}

import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTaxonomyTagDto, MergeTagDto, TaxonomyTagDto, TaxonomyTagImpactDto, UpdateTaxonomyTagDto } from './dto/tag.dto';
import { TaxonomyService } from './taxonomy.service';

@ApiTags('Taxonomy')
@Controller('taxonomy/tags')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class TagsController {
  constructor(@Inject(TaxonomyService) private readonly taxonomy: TaxonomyService) {}

  @Get()
  @ApiOperation({ summary: 'List tag options for staff document metadata.' })
  @ApiOkResponse({ type: [TaxonomyTagDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  listTags(): Promise<TaxonomyTagDto[]> {
    return this.taxonomy.listTags();
  }

  @Get(':id/impact')
  @ApiOperation({ summary: 'Get tag usage impact metrics.' })
  @ApiOkResponse({ type: TaxonomyTagImpactDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  getTagImpact(@Param('id') id: string): Promise<TaxonomyTagImpactDto> {
    return this.taxonomy.getTagImpact(id);
  }
}

@ApiTags('Admin Taxonomy')
@Controller('admin/tags')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminTagsController {
  constructor(@Inject(TaxonomyService) private readonly taxonomy: TaxonomyService) {}

  @Get(':id/impact')
  @ApiOperation({ summary: 'Get tag usage impact metrics.' })
  @ApiOkResponse({ type: TaxonomyTagImpactDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  getTagImpact(@Param('id') id: string): Promise<TaxonomyTagImpactDto> {
    return this.taxonomy.getTagImpact(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a tag.' })
  @ApiCreatedResponse({ type: TaxonomyTagDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  createTag(@Body() dto: CreateTaxonomyTagDto): Promise<TaxonomyTagDto> {
    return this.taxonomy.createTag(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit a tag.' })
  @ApiOkResponse({ type: TaxonomyTagDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  updateTag(@Param('id') id: string, @Body() dto: UpdateTaxonomyTagDto): Promise<TaxonomyTagDto> {
    return this.taxonomy.updateTag(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag and detach it from all documents.' })
  @ApiOkResponse({ description: 'Tag deleted successfully.' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  deleteTag(@Param('id') id: string) {
    return this.taxonomy.deleteTag(id);
  }

  @Post(':id/merge')
  @ApiOperation({ summary: 'Merge source tag into target tag and delete source tag.' })
  @ApiOkResponse({ description: 'Tag merged successfully.' })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  mergeTag(@Param('id') id: string, @Body() dto: MergeTagDto) {
    return this.taxonomy.mergeTag(id, dto);
  }
}


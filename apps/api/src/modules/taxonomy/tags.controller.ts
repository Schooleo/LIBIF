import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TaxonomyTagDto } from './dto/tag.dto';
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
}

import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsbnService } from './isbn.service';
import { IsbnLookupResponseDto } from './dto/isbn-response.dto';

@ApiTags('ISBN')
@Controller('isbn')
export class IsbnController {
  constructor(@Inject(IsbnService) private readonly isbn: IsbnService) {}

  @Get(':isbn')
  @ApiOperation({ summary: 'Look up metadata for an ISBN.' })
  @ApiParam({ name: 'isbn' })
  @ApiOkResponse({ type: IsbnLookupResponseDto })
  lookup(@Param('isbn') isbn: string) {
    return this.isbn.lookup(isbn);
  }
}

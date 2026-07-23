import { ApiProperty } from '@nestjs/swagger';

export class ProtectedPageDescriptorDto {
  @ApiProperty({ minimum: 1 })
  pageNumber!: number;

  @ApiProperty({ minimum: 1 })
  width!: number;

  @ApiProperty({ minimum: 1 })
  height!: number;
}

export class ProtectedDocumentManifestDto {
  @ApiProperty()
  documentId!: string;

  @ApiProperty({ minimum: 1 })
  pageCount!: number;

  @ApiProperty({ example: 0.5 })
  minZoom!: number;

  @ApiProperty({ example: 2 })
  maxZoom!: number;

  @ApiProperty({ type: [ProtectedPageDescriptorDto] })
  pages!: ProtectedPageDescriptorDto[];
}

export class ProtectedPageRateLimitDto {
  @ApiProperty({ example: 429 })
  statusCode!: 429;

  @ApiProperty({ example: 'READER_PAGE_RATE_LIMITED' })
  code!: 'READER_PAGE_RATE_LIMITED';

  @ApiProperty({ example: 'Page request limit exceeded.' })
  message!: string;

  @ApiProperty({ minimum: 1, description: 'Seconds until the next page request may be attempted.' })
  retryAfterSeconds!: number;
}

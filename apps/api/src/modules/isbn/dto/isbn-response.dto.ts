import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IsbnMetadataDto {
  @ApiPropertyOptional()
  isbn?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({ type: [String] })
  authors?: string[];

  @ApiPropertyOptional()
  publisher?: string;

  @ApiPropertyOptional()
  publishedYear?: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  language?: string;
}

export class IsbnLookupResponseDto {
  @ApiProperty()
  found!: boolean;

  @ApiPropertyOptional({ type: IsbnMetadataDto })
  metadata?: IsbnMetadataDto;

  @ApiPropertyOptional()
  message?: string;
}

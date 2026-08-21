import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class DocumentPageSearchQueryDto {
  @ApiProperty({ minLength: 2, maxLength: 100 })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  q!: string;
}

export class DocumentPageSearchResultDto {
  @ApiProperty()
  pageNumber!: number;

  @ApiProperty()
  matchCount!: number;

  @ApiPropertyOptional({ type: String })
  snippet?: string;
}

export class DocumentPageSearchResponseDto {
  @ApiProperty()
  available!: boolean;

  @ApiProperty()
  query!: string;

  @ApiProperty({ type: [DocumentPageSearchResultDto], maxItems: 5 })
  results!: DocumentPageSearchResultDto[];

  @ApiProperty()
  totalMatches!: number;

  @ApiProperty()
  totalPagesWithMatches!: number;

  @ApiProperty()
  truncated!: boolean;
}

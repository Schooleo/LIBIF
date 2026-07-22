import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaxonomyCategoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  parentId!: string | null;
}

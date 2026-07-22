import { ApiProperty } from '@nestjs/swagger';

export class TaxonomyTagDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;
}

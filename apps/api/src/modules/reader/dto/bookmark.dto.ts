import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkDto {
  @ApiProperty({ example: 'cm123456789', description: 'Document ID to bookmark' })
  @IsString()
  @IsNotEmpty()
  documentId!: string;
}

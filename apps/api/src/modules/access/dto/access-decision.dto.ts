import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccessDecisionDto {
  @ApiProperty({ example: true, description: 'Whether the current user is eligible to view/download this document' })
  allowed!: boolean;

  @ApiProperty({ example: 'cm123456789' })
  documentId!: string;

  @ApiProperty({ example: 'READER' })
  userRole!: string;

  @ApiPropertyOptional({
    example: 'PUBLISHED',
    description: 'Current lifecycle status of the document (reader-safe subset)',
    enum: ['DRAFT', 'PENDING_PROCESSING', 'PROCESSING', 'PENDING_APPROVAL', 'CORRECTION_REQUIRED', 'PUBLISHED', 'REJECTED'],
  })
  documentStatus?: string;

  @ApiPropertyOptional({ example: 'Document is published and available.' })
  reason?: string;
}

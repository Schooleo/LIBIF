import { ApiProperty } from '@nestjs/swagger';

export class ProtectedDocumentUrlDto {
  @ApiProperty({ example: 'access_token_abc123' })
  token!: string;

  @ApiProperty({ example: '2026-07-21T11:45:00.000Z' })
  expiresAt!: string;

  @ApiProperty({ example: '/api/access/stream?token=access_token_abc123' })
  url!: string;
}

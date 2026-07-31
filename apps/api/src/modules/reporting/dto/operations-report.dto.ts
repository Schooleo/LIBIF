import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class OperationsReportRangeQueryDto {
  @ApiPropertyOptional({ format: 'date-time', description: 'Inclusive UTC range start.' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ format: 'date-time', description: 'Exclusive UTC range end.' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export class ReaderSecuritySummaryDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  rateLimited!: number;

  @ApiProperty()
  scrapeSuspected!: number;

  @ApiProperty()
  highRisk!: number;
}

export class ManagementDashboardSummaryDto {
  @ApiProperty({ format: 'date-time' })
  generatedAt!: string;

  @ApiProperty({ format: 'date-time' })
  from!: string;

  @ApiProperty({ format: 'date-time' })
  to!: string;

  @ApiProperty()
  documentsCreated!: number;

  @ApiProperty()
  usersCreated!: number;

  @ApiProperty()
  activityEvents!: number;

  @ApiProperty({ type: () => ReaderSecuritySummaryDto })
  readerSecurity!: ReaderSecuritySummaryDto;
}

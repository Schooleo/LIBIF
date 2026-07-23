import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel
} from '../../../generated/prisma/client';

export class ReaderAccessReportQueryDto {
  @ApiPropertyOptional({ format: 'date-time', description: 'Inclusive UTC range start.' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ format: 'date-time', description: 'Exclusive UTC range end.' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ enum: ReaderAccessRiskLevel })
  @IsOptional()
  @IsEnum(ReaderAccessRiskLevel)
  risk?: ReaderAccessRiskLevel;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number;
}

export class ReaderAccessReportItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  documentId!: string;

  @ApiProperty({ description: 'Masked display label; never a raw account identifier.' })
  readerLabel!: string;

  @ApiProperty({ enum: ReaderAccessEventType })
  eventType!: ReaderAccessEventType;

  @ApiProperty({ enum: ReaderAccessRiskLevel })
  riskLevel!: ReaderAccessRiskLevel;

  @ApiPropertyOptional({ enum: ReaderAccessReasonCode, nullable: true })
  reasonCode?: ReaderAccessReasonCode | null;

  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1 })
  pageNumber?: number | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'Opaque SHA-256 fingerprint used to resolve a visible watermark trace.'
  })
  traceFingerprint?: string | null;

  @ApiProperty({ format: 'date-time' })
  occurredAt!: string;
}

export class ReaderAccessRiskCountsDto {
  @ApiProperty()
  none!: number;

  @ApiProperty()
  low!: number;

  @ApiProperty()
  medium!: number;

  @ApiProperty()
  high!: number;
}

export class ReaderAccessReportResponseDto {
  @ApiProperty({ format: 'date-time' })
  generatedAt!: string;

  @ApiProperty({ type: () => ReaderAccessRiskCountsDto })
  riskCounts!: ReaderAccessRiskCountsDto;

  @ApiProperty({ type: [ReaderAccessReportItemDto] })
  items!: ReaderAccessReportItemDto[];

  @ApiProperty()
  totalCount!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

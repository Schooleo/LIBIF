import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveReviewDto {
  @ApiPropertyOptional({ type: String, description: 'Optional reviewer comment' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectReviewDto {
  @ApiProperty({ type: String, description: 'Required reason for rejecting document' })
  @IsString()
  @IsNotEmpty({ message: 'Reason for rejection is required' })
  reason!: string;
}

export class RequestCorrectionDto {
  @ApiProperty({ type: String, description: 'Reason for requesting correction' })
  @IsString()
  @IsNotEmpty({ message: 'Reason for correction request is required' })
  reason!: string;

  @ApiProperty({ type: String, description: 'Specific metadata or file changes requested' })
  @IsString()
  @IsNotEmpty({ message: 'Requested changes detail is required' })
  requestedChanges!: string;
}

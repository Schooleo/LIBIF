import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApprovalReviewStatus } from '../../generated/prisma/client';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApprovalService } from './approval.service';
import { ApprovalReviewResponseDto } from './dto/approval-review.dto';

@ApiTags('Admin Approvals')
@Controller('admin/approvals')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class ApprovalController {
  constructor(@Inject(ApprovalService) private readonly approvalService: ApprovalService) {}

  @Get()
  @ApiOperation({ summary: 'List pending approval reviews.' })
  @ApiQuery({ name: 'status', enum: ApprovalReviewStatus, required: false })
  @ApiOkResponse({ type: [ApprovalReviewResponseDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async listReviews(@Query('status') status?: ApprovalReviewStatus): Promise<ApprovalReviewResponseDto[]> {
    return this.approvalService.listPendingReviews(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval review details.' })
  @ApiOkResponse({ type: ApprovalReviewResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async getReviewById(@Param('id') id: string): Promise<ApprovalReviewResponseDto> {
    return this.approvalService.getReviewById(id);
  }
}

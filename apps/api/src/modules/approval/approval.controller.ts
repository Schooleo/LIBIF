import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApprovalReviewStatus } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApprovalService } from './approval.service';
import { ApproveReviewDto, RejectReviewDto, RequestCorrectionDto } from './dto/approval-action.dto';
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

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a document review.' })
  @ApiOkResponse({ type: ApprovalReviewResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async approveReview(
    @Param('id') id: string,
    @CurrentUser() user: SessionUserDto,
    @Body() dto?: ApproveReviewDto
  ): Promise<ApprovalReviewResponseDto> {
    return this.approvalService.approveReview(id, user.id, dto);
  }

  @Post(':id/approve-and-publish')
  @ApiOperation({ summary: 'Approve and publish a document to the catalogue.' })
  @ApiOkResponse({ type: ApprovalReviewResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async approveAndPublish(
    @Param('id') id: string,
    @CurrentUser() user: SessionUserDto,
    @Body() dto?: ApproveReviewDto
  ): Promise<ApprovalReviewResponseDto> {
    return this.approvalService.approveAndPublish(id, user.id, dto);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a document review.' })
  @ApiOkResponse({ type: ApprovalReviewResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async rejectReview(
    @Param('id') id: string,
    @CurrentUser() user: SessionUserDto,
    @Body() dto: RejectReviewDto
  ): Promise<ApprovalReviewResponseDto> {
    return this.approvalService.rejectReview(id, user.id, dto);
  }

  @Post(':id/request-correction')
  @ApiOperation({ summary: 'Request metadata or file corrections from the uploader.' })
  @ApiOkResponse({ type: ApprovalReviewResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async requestCorrection(
    @Param('id') id: string,
    @CurrentUser() user: SessionUserDto,
    @Body() dto: RequestCorrectionDto
  ): Promise<ApprovalReviewResponseDto> {
    return this.approvalService.requestCorrection(id, user.id, dto);
  }
}

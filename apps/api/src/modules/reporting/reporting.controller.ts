import { Controller, Get, Inject, Query, Res, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LibrarianDashboardSummaryDto } from './dto/librarian-dashboard-summary.dto';
import {
  ManagementDashboardSummaryDto,
  OperationsReportRangeQueryDto
} from './dto/operations-report.dto';
import { ReaderAccessReportQueryDto, ReaderAccessReportResponseDto } from './dto/reader-access-report.dto';
import { ReportingService } from './reporting.service';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class ReportingController {
  constructor(@Inject(ReportingService) private readonly reporting: ReportingService) {}

  @Get('librarian')
  @ApiOperation({ summary: 'Return librarian dashboard summary counts.' })
  @ApiOkResponse({ type: LibrarianDashboardSummaryDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getLibrarianDashboardSummary(
    @Query() query: OperationsReportRangeQueryDto
  ): Promise<LibrarianDashboardSummaryDto> {
    return this.reporting.getLibrarianDashboardSummary(query);
  }

  @Get('management')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Return a bounded UTC management and reader-security summary.' })
  @ApiOkResponse({ type: ManagementDashboardSummaryDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getManagementDashboardSummary(
    @Query() query: OperationsReportRangeQueryDto
  ): Promise<ManagementDashboardSummaryDto> {
    return this.reporting.getManagementDashboardSummary(query);
  }
}

@ApiTags('Admin Reports')
@Controller('admin/reports')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class ReaderAccessReportingController {
  constructor(@Inject(ReportingService) private readonly reporting: ReportingService) {}

  @Get('reader-access')
  @ApiOperation({ summary: 'Return bounded reader access report rows for admins.' })
  @ApiOkResponse({ type: ReaderAccessReportResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getReaderAccessReport(@Query() query: ReaderAccessReportQueryDto): Promise<ReaderAccessReportResponseDto> {
    return this.reporting.getReaderAccessReport(query);
  }

  @Get('reader-access.csv')
  @ApiOperation({ summary: 'Export bounded reader access report rows as CSV for admins.' })
  @ApiProduces('text/csv')
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'risk', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async exportReaderAccessCsv(@Query() query: ReaderAccessReportQueryDto, @Res() response: Response): Promise<void> {
    const csv = await this.reporting.exportReaderAccessCsv(query);
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename="reader-access-report.csv"');
    response.send(csv);
  }

  @Get('documents.csv')
  @ApiOperation({ summary: 'Export a bounded UTC document operations report.' })
  @ApiProduces('text/csv')
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async exportDocumentsCsv(
    @Query() query: OperationsReportRangeQueryDto,
    @Res() response: Response
  ): Promise<void> {
    sendCsv(response, await this.reporting.exportDocumentsCsv(query), 'documents-report.csv');
  }

  @Get('users.csv')
  @ApiOperation({ summary: 'Export a bounded UTC safe user administration report.' })
  @ApiProduces('text/csv')
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async exportUsersCsv(
    @Query() query: OperationsReportRangeQueryDto,
    @Res() response: Response
  ): Promise<void> {
    sendCsv(response, await this.reporting.exportUsersCsv(query), 'users-report.csv');
  }

  @Get('activity.csv')
  @ApiOperation({ summary: 'Export a bounded UTC document activity report.' })
  @ApiProduces('text/csv')
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async exportActivityCsv(
    @Query() query: OperationsReportRangeQueryDto,
    @Res() response: Response
  ): Promise<void> {
    sendCsv(response, await this.reporting.exportActivityCsv(query), 'activity-report.csv');
  }
}

function sendCsv(response: Response, csv: string, filename: string): void {
  response.setHeader('Content-Type', 'text/csv; charset=utf-8');
  response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  response.send(csv);
}

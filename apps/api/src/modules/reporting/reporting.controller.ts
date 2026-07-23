import { Controller, Get, Inject, Query, Res, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LibrarianDashboardSummaryDto } from './dto/librarian-dashboard-summary.dto';
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
  getLibrarianDashboardSummary(): Promise<LibrarianDashboardSummaryDto> {
    return this.reporting.getLibrarianDashboardSummary();
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
}

import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LibrarianDashboardSummaryDto } from './dto/librarian-dashboard-summary.dto';
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

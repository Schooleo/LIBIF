import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ProcessingJobResponseDto } from './dto/processing-job.dto';
import { ProcessingService } from './processing.service';

@ApiTags('Admin Processing')
@Controller('admin/processing/jobs')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class ProcessingController {
  constructor(@Inject(ProcessingService) private readonly processingService: ProcessingService) {}

  @Get()
  @ApiOperation({ summary: 'List processing jobs.' })
  @ApiOkResponse({ type: [ProcessingJobResponseDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async listJobs(): Promise<ProcessingJobResponseDto[]> {
    return this.processingService.listJobs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get processing job details.' })
  @ApiOkResponse({ type: ProcessingJobResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async getJobById(@Param('id') id: string): Promise<ProcessingJobResponseDto> {
    return this.processingService.getJobById(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get processing job status only.' })
  @ApiOkResponse({ type: String, description: 'The status of the processing job.' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async getJobStatus(@Param('id') id: string): Promise<string> {
    const job = await this.processingService.getJobById(id);
    return job.status;
  }

  @Post(':id/advance')
  @ApiOperation({ summary: 'Advance processing job status (simulate progress).' })
  @ApiOkResponse({ type: ProcessingJobResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async advanceJob(@Param('id') id: string): Promise<ProcessingJobResponseDto> {
    return this.processingService.advanceJob(id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry a failed processing job.' })
  @ApiOkResponse({ type: ProcessingJobResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async retryJob(@Param('id') id: string): Promise<ProcessingJobResponseDto> {
    return this.processingService.retryJob(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an active processing job.' })
  @ApiOkResponse({ type: ProcessingJobResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async cancelJob(@Param('id') id: string): Promise<ProcessingJobResponseDto> {
    return this.processingService.cancelJob(id);
  }
}

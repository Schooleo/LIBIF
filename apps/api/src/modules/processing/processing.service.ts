import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProcessingJobResponseDto } from './dto/processing-job.dto';

@Injectable()
export class ProcessingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listJobs(): Promise<ProcessingJobResponseDto[]> {
    const jobs = await this.prisma.processingJob.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map((job) => this.mapToDto(job));
  }

  async getJobById(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id },
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }
    return this.mapToDto(job);
  }

  private mapToDto(job: any): ProcessingJobResponseDto {
    return {
      id: job.id,
      bookId: job.bookId,
      type: job.type,
      status: job.status,
      attempts: job.attempts,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };
  }
}

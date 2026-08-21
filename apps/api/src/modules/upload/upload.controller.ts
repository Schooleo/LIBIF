import { BadRequestException, Body, Controller, Get, Inject, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MAX_PDF_SIZE_BYTES } from '../storage/pdf-validation';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadResultDto } from './dto/upload-result.dto';
import { UploadService } from './upload.service';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class UploadController {
  constructor(@Inject(UploadService) private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Create a digital document upload and queue processing intake.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'metadata'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Document PDF file.' },
        metadata: { type: 'string', description: 'JSON string matching CreateUploadDto.' }
      }
    }
  })
  @ApiCreatedResponse({ type: UploadResultDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE_BYTES } }))
  async createUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
    @CurrentUser() user: SessionUserDto
  ) {
    const parsed = await this.parseMetadata(metadata);
    return this.uploadService.createUpload(parsed, file, user.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload intake and file validation status.' })
  @ApiOkResponse({ type: UploadResultDto })
  @ApiNotFoundResponse({ description: 'Upload record not found' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getUploadState(@Param('id') id: string) {
    return this.uploadService.getUploadState(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel pending upload intake.' })
  @ApiOkResponse({ description: 'Cancellation result message' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  cancelUpload(@Param('id') id: string, @CurrentUser() user: SessionUserDto) {
    return this.uploadService.cancelUpload(id, user.email);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry failed or cancelled upload intake processing.' })
  @ApiOkResponse({ type: UploadResultDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  retryUpload(@Param('id') id: string, @CurrentUser() user: SessionUserDto) {
    return this.uploadService.retryUpload(id, user.email);
  }

  private async parseMetadata(metadata: string): Promise<CreateUploadDto> {
    if (!metadata) {
      throw new BadRequestException('metadata JSON field is required.');
    }
    let raw: unknown;
    try {
      raw = JSON.parse(metadata);
    } catch {
      throw new BadRequestException('metadata must be valid JSON.');
    }
    const dto = plainToInstance(CreateUploadDto, raw);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.flatMap((error) => Object.values(error.constraints ?? {})).join('; '));
    }
    return dto;
  }
}

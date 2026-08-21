import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MAX_PDF_SIZE_BYTES } from '../storage/pdf-validation';
import { DocumentsService } from './documents.service';
import { DocumentDetailResponseDto, PagedDocumentListResponseDto } from './dto/document-detail.dto';
import { DocumentListQueryDto } from './dto/document-list-query.dto';
import { UpdateDocumentMetadataDto } from './dto/update-document-metadata.dto';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class DocumentsController {
  constructor(@Inject(DocumentsService) private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List digital document records for staff with filtering and pagination.' })
  @ApiOkResponse({ type: PagedDocumentListResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  listDocuments(@Query() query: DocumentListQueryDto) {
    return this.documentsService.listDocuments(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed document record including active file version, processing status, and audit history.' })
  @ApiOkResponse({ type: DocumentDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getDocumentDetail(@Param('id') id: string) {
    return this.documentsService.getDocumentDetail(id);
  }

  @Patch(':id/metadata')
  @ApiOperation({ summary: 'Update document metadata.' })
  @ApiOkResponse({ type: DocumentDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  updateMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentMetadataDto,
    @CurrentUser() user: SessionUserDto
  ) {
    return this.documentsService.updateMetadata(id, dto, user.email);
  }

  @Post(':id/submit-processing')
  @ApiOperation({ summary: 'Submit or re-queue document active file into processing.' })
  @ApiOkResponse({ type: DocumentDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  submitProcessing(@Param('id') id: string, @CurrentUser() user: SessionUserDto) {
    return this.documentsService.submitProcessing(id, user.email);
  }

  @Post(':id/replace-file')
  @ApiOperation({ summary: 'Replace the active PDF file of a document.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'PDF file to replace current active version.' }
      }
    }
  })
  @ApiCreatedResponse({ type: DocumentDetailResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE_BYTES } }))
  replaceFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: SessionUserDto
  ) {
    return this.documentsService.replaceFile(id, file, user.email);
  }
}

import { Controller, Get, HttpCode, Inject, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccessService } from './access.service';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentUrlDto } from './dto/protected-document-url.dto';

function formatContentDisposition(type: 'inline' | 'attachment', filename: string): string {
  const asciiFilename = filename.replace(/[^\x20-\x7E]/g, '_');
  const encodedFilename = encodeURIComponent(filename);
  return `${type}; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`;
}

@ApiTags('Access')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('READER', 'LIBRARIAN', 'ADMIN')
@Controller('access')
export class AccessController {
  constructor(@Inject(AccessService) private readonly accessService: AccessService) {}

  @Get('documents/:documentId/decision')
  @ApiOperation({ summary: 'Check access decision for a document by reader or staff role.' })
  @ApiOkResponse({ type: AccessDecisionDto })
  getDecision(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<AccessDecisionDto> {
    return this.accessService.getAccessDecision(user.id, user.role, documentId);
  }

  @Post('documents/:documentId/view-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtain a protected viewing URL token for an accessible document.' })
  @ApiOkResponse({ type: ProtectedDocumentUrlDto })
  createViewToken(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    return this.accessService.createViewToken(user.id, user.role, documentId);
  }

  @Post('documents/:documentId/download-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtain a protected download URL token for an accessible document.' })
  @ApiOkResponse({ type: ProtectedDocumentUrlDto })
  createDownloadToken(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    return this.accessService.createDownloadToken(user.id, user.role, documentId);
  }

  @Get('documents/:documentId/stream')
  @ApiOperation({ summary: 'Stream protected document PDF content.' })
  async streamDocument(
    @Param('documentId') documentId: string,
    @Query('token') token: string,
    @Res() res: Response
  ): Promise<void> {
    const file = await this.accessService.getDocumentFile(documentId, token);
    const buffer = await this.accessService.getFileBuffer(file.bucket, file.objectKey);
    res.setHeader('Content-Type', file.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', formatContentDisposition('inline', file.originalFilename));
    res.send(buffer);
  }

  @Get('documents/:documentId/file')
  @ApiOperation({ summary: 'Download protected document PDF file.' })
  async downloadDocument(
    @Param('documentId') documentId: string,
    @Query('token') token: string,
    @Res() res: Response
  ): Promise<void> {
    const file = await this.accessService.getDocumentFile(documentId, token);
    const buffer = await this.accessService.getFileBuffer(file.bucket, file.objectKey);
    res.setHeader('Content-Type', file.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', formatContentDisposition('attachment', file.originalFilename));
    res.send(buffer);
  }
}

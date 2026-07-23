import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccessService } from './access.service';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentManifestDto } from './dto/protected-document-manifest.dto';
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

  @Get('documents/:documentId/manifest')
  @ApiOperation({ summary: 'Get protected document manifest metadata for reader canvas viewing.' })
  @ApiOkResponse({ type: ProtectedDocumentManifestDto })
  getManifest(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<ProtectedDocumentManifestDto> {
    return this.accessService.getDocumentManifest(user.id, user.role, documentId);
  }

  @Get('documents/:documentId/pages/:pageNumber')
  @ApiOperation({ summary: 'Get an authorized, server-watermarked page image.' })
  @ApiProduces('image/png', 'image/webp')
  async getPage(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const sessionId = (req.cookies as Record<string, string> | undefined)?.['libif_session'];
    const pageResult = await this.accessService.getProtectedPage(
      user.id,
      user.role,
      sessionId,
      documentId,
      pageNumber,
    );

    res.setHeader('Content-Type', pageResult.contentType);
    res.setHeader('Cache-Control', pageResult.cacheControl);
    res.setHeader('X-Trace-Fingerprint', pageResult.traceFingerprint);
    res.send(pageResult.content);
  }

  @Post('documents/:documentId/view-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtain a protected viewing URL token for staff or legacy viewer.' })
  @ApiOkResponse({ type: ProtectedDocumentUrlDto })
  createViewToken(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    return this.accessService.createViewToken(user.id, user.role, documentId);
  }

  @Post('documents/:documentId/download-token')
  @Roles('LIBRARIAN', 'ADMIN')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtain a protected download URL token (staff only).' })
  @ApiOkResponse({ type: ProtectedDocumentUrlDto })
  createDownloadToken(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    return this.accessService.createDownloadToken(user.id, user.role, documentId);
  }

  @Get('documents/:documentId/stream')
  @ApiOperation({ summary: 'Stream protected document PDF content (staff internal).' })
  async streamDocument(
    @Param('documentId') documentId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.accessService.getDocumentFile(documentId, token);
    const buffer = await this.accessService.getFileBuffer(file.bucket, file.objectKey);
    res.setHeader('Content-Type', file.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', formatContentDisposition('inline', file.originalFilename));
    res.send(buffer);
  }

  @Get('documents/:documentId/file')
  @ApiOperation({ summary: 'Download protected document PDF file (staff internal).' })
  async downloadDocument(
    @Param('documentId') documentId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.accessService.getDocumentFile(documentId, token);
    const buffer = await this.accessService.getFileBuffer(file.bucket, file.objectKey);
    res.setHeader('Content-Type', file.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', formatContentDisposition('attachment', file.originalFilename));
    res.send(buffer);
  }
}

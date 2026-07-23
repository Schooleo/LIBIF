import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentUrlDto } from './dto/protected-document-url.dto';
import { ProtectedDocumentManifestDto } from './dto/protected-document-manifest.dto';
import { PROTECTED_PAGE_RENDERER, ProtectedPageRenderer } from '../rendering/protected-page-renderer.port';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import { ReaderRateLimitService } from './reader-rate-limit.service';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import { PERSONALIZED_PAGE_CACHE_CONTROL } from './contracts/reader-access.contract';

/** Reader-safe status denial messages that do not leak admin-only processing internals. */
const READER_DENIAL_REASONS: Record<string, string> = {
  DRAFT: 'This document is not yet available for reading.',
  PENDING_PROCESSING: 'This document is being prepared and will be available shortly.',
  PROCESSING: 'This document is currently being processed. Please check back later.',
  PENDING_APPROVAL: 'This document is under review and not yet publicly available.',
  CORRECTION_REQUIRED: 'This document is under revision and not yet publicly available.',
  REJECTED: 'This document is not available for reading.',
};

@Injectable()
export class AccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly auditService: ReaderAccessAuditService,
    private readonly rateLimitService: ReaderRateLimitService,
    @Inject(PROTECTED_PAGE_RENDERER)
    private readonly pageRenderer: ProtectedPageRenderer,
  ) {}

  async getAccessDecision(
    userId: string,
    userRole: string,
    documentId: string,
  ): Promise<AccessDecisionDto> {
    const book = await this.prisma.book.findUnique({
      where: { id: documentId },
    });

    if (!book) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    const isStaff = userRole === 'ADMIN' || userRole === 'LIBRARIAN';
    const isPublished = book.status === 'PUBLISHED';

    if (isPublished || isStaff) {
      return {
        allowed: true,
        documentId,
        userRole,
        documentStatus: book.status,
        reason: isPublished
          ? 'Document is published and available for reading.'
          : 'Staff access granted for unpublished document.',
      };
    }

    const reason =
      READER_DENIAL_REASONS[book.status] ?? 'Document is not available for reading.';

    return {
      allowed: false,
      documentId,
      userRole,
      documentStatus: book.status,
      reason,
    };
  }

  async getDocumentManifest(
    userId: string,
    userRole: string,
    documentId: string,
  ): Promise<ProtectedDocumentManifestDto> {
    const decision = await this.getAccessDecision(userId, userRole, documentId);
    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const activeFile = await this.getActiveFile(documentId);

    // Call renderer for base page 1 metadata
    const rendered = await this.pageRenderer.renderBasePage({
      bookFileId: activeFile.id,
      bucket: activeFile.bucket,
      objectKey: activeFile.objectKey,
      pageNumber: 1,
      profile: 'READER_STANDARD',
    });

    const pageCount = rendered.pageCount;
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      pageNumber: i + 1,
      width: rendered.width,
      height: rendered.height,
    }));

    return {
      documentId,
      pageCount,
      minZoom: 0.5,
      maxZoom: 2.0,
      pages,
    };
  }

  async getProtectedPage(
    userId: string,
    userRole: string,
    sessionId: string | undefined,
    documentId: string,
    pageNumber: number,
  ) {
    const decision = await this.getAccessDecision(userId, userRole, documentId);
    const now = new Date();

    if (!decision.allowed) {
      // Record denied audit event
      await this.auditService.recordEvent({
        eventType: ReaderAccessEventType.PAGE_DENIED,
        riskLevel: ReaderAccessRiskLevel.LOW,
        reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
        userId,
        sessionId,
        bookId: documentId,
        pageNumber,
        createdAt: now,
      });
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const activeFile = await this.getActiveFile(documentId);

    // Initial base page lookup to discover pageCount
    const initialBasePage = await this.pageRenderer.renderBasePage({
      bookFileId: activeFile.id,
      bucket: activeFile.bucket,
      objectKey: activeFile.objectKey,
      pageNumber: 1,
      profile: 'READER_STANDARD',
    });

    // Check rate limit and bounds
    const rateCheck = await this.rateLimitService.checkPageAccessRate(
      userId,
      sessionId,
      pageNumber,
      initialBasePage.pageCount,
    );

    if (!rateCheck.allowed) {
      // Record audit event for rate limit / scrape / invalid page
      await this.auditService.recordEvent({
        eventType: rateCheck.eventType ?? ReaderAccessEventType.PAGE_DENIED,
        riskLevel: rateCheck.riskLevel ?? ReaderAccessRiskLevel.LOW,
        reasonCode: rateCheck.reasonCode ?? ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
        userId,
        sessionId,
        bookId: documentId,
        bookFileId: activeFile.id,
        pageNumber,
        createdAt: now,
      });

      if (rateCheck.reasonCode === ReaderAccessReasonCode.PAGE_OUT_OF_RANGE) {
        throw new NotFoundException(`Page ${pageNumber} is out of range`);
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          code: 'READER_PAGE_RATE_LIMITED',
          message: 'Page request limit exceeded. Please wait before requesting additional pages.',
          retryAfterSeconds: rateCheck.retryAfterSeconds ?? 60,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Generate trace fingerprint
    const traceFingerprint = createHash('sha256')
      .update(`${userId}:${sessionId ?? 'no_session'}:${documentId}:${pageNumber}:${now.toISOString()}`)
      .digest('hex');

    const maskedReaderLabel = `READER-${userId.slice(-4)}`;

    // Render requested base page
    const basePage =
      pageNumber === 1
        ? initialBasePage
        : await this.pageRenderer.renderBasePage({
            bookFileId: activeFile.id,
            bucket: activeFile.bucket,
            objectKey: activeFile.objectKey,
            pageNumber,
            profile: 'READER_STANDARD',
          });

    // Compose watermark
    const watermarked = await this.pageRenderer.composeWatermark({
      basePage,
      maskedReaderLabel,
      occurredAt: now,
      documentId,
      pageNumber,
      opaqueTrace: traceFingerprint,
    });

    // Record PAGE_SERVED audit event (fail-closed)
    await this.auditService.recordEvent({
      eventType: ReaderAccessEventType.PAGE_SERVED,
      riskLevel: ReaderAccessRiskLevel.NONE,
      userId,
      sessionId,
      bookId: documentId,
      bookFileId: activeFile.id,
      pageNumber,
      traceFingerprint,
      createdAt: now,
    });

    return {
      content: watermarked.content,
      contentType: watermarked.contentType,
      cacheControl: PERSONALIZED_PAGE_CACHE_CONTROL,
      traceFingerprint,
    };
  }

  async createViewToken(
    userId: string,
    userRole: string,
    documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    const decision = await this.getAccessDecision(userId, userRole, documentId);
    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const token = `view_${documentId}_${Date.now()}`;
    const url = `/api/access/documents/${documentId}/stream?token=${token}`;

    return {
      token,
      expiresAt,
      url,
    };
  }

  async createDownloadToken(
    userId: string,
    userRole: string,
    documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    // Explicitly deny Reader role from obtaining download tokens
    if (userRole === 'READER') {
      throw new ForbiddenException(
        'Document source downloads are restricted. Readers must use the integrated watermarked viewer.',
      );
    }

    const decision = await this.getAccessDecision(userId, userRole, documentId);
    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason || 'Access denied for document downloading');
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const token = `download_${documentId}_${Date.now()}`;
    const url = `/api/access/documents/${documentId}/file?token=${token}`;

    return {
      token,
      expiresAt,
      url,
    };
  }

  async getDocumentFile(documentId: string, token: string) {
    if (
      !token ||
      (!token.startsWith(`view_${documentId}`) && !token.startsWith(`download_${documentId}`))
    ) {
      throw new ForbiddenException('Invalid or expired view token');
    }

    const book = await this.prisma.book.findUnique({
      where: { id: documentId },
      include: {
        files: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    const file = book.files.find((f) => f.status === 'ACTIVE') || book.files[0];
    if (!file) {
      throw new NotFoundException(`Document ${documentId} has no associated file`);
    }

    return file;
  }

  async getFileBuffer(bucket: string, objectKey: string): Promise<Buffer> {
    return this.storage.getObjectBuffer(bucket, objectKey);
  }

  private async getActiveFile(documentId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: documentId },
      include: {
        files: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    const file = book.files.find((f) => f.status === 'ACTIVE') || book.files[0];
    if (!file) {
      throw new NotFoundException(`Document ${documentId} has no associated file`);
    }

    return file;
  }
}

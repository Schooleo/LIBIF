import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  PROTECTED_PAGE_RENDERER,
  ProtectedPageRenderer,
  type RenderedBasePage,
  type WatermarkedPage,
} from '../rendering/protected-page-renderer.port';
import { StorageService } from '../storage/storage.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import {
  PERSONALIZED_PAGE_CACHE_CONTROL,
} from './contracts/reader-access.contract';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentManifestDto } from './dto/protected-document-manifest.dto';
import { ProtectedDocumentUrlDto } from './dto/protected-document-url.dto';
import {
  DetectorDependencyUnavailableError,
  ReaderRateLimitService,
} from './reader-rate-limit.service';

const READER_DENIAL_REASONS: Record<string, string> = {
  DRAFT: 'This document is not yet available for reading.',
  PENDING_PROCESSING: 'This document is being prepared and will be available shortly.',
  PROCESSING: 'This document is currently being processed. Please check back later.',
  PENDING_APPROVAL: 'This document is under review and not yet publicly available.',
  CORRECTION_REQUIRED: 'This document is under revision and not yet publicly available.',
  REJECTED: 'This document is not available for reading.',
};

const STAFF_ONLY_SOURCE_MESSAGE =
  'Document source access is restricted to staff-managed internal workflows.';
const VIEWER_UNAVAILABLE_MESSAGE =
  'Protected page delivery is temporarily unavailable. Please try again later.';
const SOURCE_TOKEN_TTL_MS = 60 * 60 * 1000;

type StaffFilePurpose = 'view' | 'download';

@Injectable()
export class AccessService {
  private readonly sourceTokenSecret?: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly auditService: ReaderAccessAuditService,
    private readonly rateLimitService: ReaderRateLimitService,
    @Inject(PROTECTED_PAGE_RENDERER)
    private readonly pageRenderer: ProtectedPageRenderer,
    @Optional() @Inject(ConfigService) config?: ConfigService,
  ) {
    const configuredSecret = config?.get<string>('LIBIF_SOURCE_ACCESS_TOKEN_SECRET')?.trim();
    const nodeEnv = config?.get<string>('NODE_ENV') ?? process.env.NODE_ENV;
    this.sourceTokenSecret =
      configuredSecret || (nodeEnv === 'production' ? undefined : randomBytes(32).toString('hex'));
  }

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

    const isStaff = isStaffRole(userRole);
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
      await this.recordDeniedAccessEvent({
        userId,
        documentId,
        reasonCode: denialReasonCode(decision.documentStatus),
      });
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const activeFile = await this.getActiveFile(documentId);

    const rendered = await this.pageRenderer.renderBasePage({
      bookFileId: activeFile.id,
      bucket: activeFile.bucket,
      objectKey: activeFile.objectKey,
      pageNumber: 1,
      profile: 'READER_STANDARD',
    });

    await this.auditService.recordEvent({
      eventType: ReaderAccessEventType.VIEWER_OPENED,
      riskLevel: ReaderAccessRiskLevel.NONE,
      userId,
      bookId: documentId,
      bookFileId: activeFile.id,
      createdAt: new Date(),
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
      await this.recordDeniedAccessEvent({
        userId,
        documentId,
        sessionId,
        pageNumber,
        reasonCode: denialReasonCode(decision.documentStatus),
      });
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const activeFile = await this.getActiveFile(documentId);
    let initialBasePage: RenderedBasePage;
    try {
      initialBasePage = await this.pageRenderer.renderBasePage({
        bookFileId: activeFile.id,
        bucket: activeFile.bucket,
        objectKey: activeFile.objectKey,
        pageNumber: 1,
        profile: 'READER_STANDARD',
      });
    } catch {
      await this.recordDependencyUnavailableEvent({
        userId,
        documentId,
        sessionId,
        bookFileId: activeFile.id,
        pageNumber,
        createdAt: now,
      });
      throw new ServiceUnavailableException(VIEWER_UNAVAILABLE_MESSAGE);
    }

    let rateCheck;
    try {
      rateCheck = await this.rateLimitService.checkPageAccessRate(
        userId,
        sessionId,
        pageNumber,
        initialBasePage.pageCount,
        documentId,
      );
    } catch (error) {
      if (error instanceof DetectorDependencyUnavailableError) {
        await this.recordDependencyUnavailableEvent({
          userId,
          documentId,
          sessionId,
          bookFileId: activeFile.id,
          pageNumber,
          createdAt: now,
        });
        throw new ServiceUnavailableException(VIEWER_UNAVAILABLE_MESSAGE);
      }
      throw error;
    }

    if (!rateCheck.allowed) {
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

    const traceFingerprint = createHash('sha256')
      .update(`${userId}:${sessionId ?? 'no_session'}:${documentId}:${pageNumber}:${now.toISOString()}`)
      .update(randomBytes(16))
      .digest('hex');

    const maskedReaderLabel = `READER-${userId.slice(-4)}`;

    let watermarked: WatermarkedPage;
    try {
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

      watermarked = await this.pageRenderer.composeWatermark({
        basePage,
        maskedReaderLabel,
        occurredAt: now,
        documentId,
        pageNumber,
        opaqueTrace: traceFingerprint,
      });
    } catch {
      await this.recordDependencyUnavailableEvent({
        userId,
        documentId,
        sessionId,
        bookFileId: activeFile.id,
        pageNumber,
        createdAt: now,
      });
      throw new ServiceUnavailableException(VIEWER_UNAVAILABLE_MESSAGE);
    }

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
    await this.ensureStaffSourceAccess(userId, userRole, documentId);

    const decision = await this.getAccessDecision(userId, userRole, documentId);
    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason || 'Access denied for document viewing');
    }

    const expiresAt = new Date(Date.now() + SOURCE_TOKEN_TTL_MS);
    const token = this.createSourceToken(userId, documentId, 'view', expiresAt);
    const url = `/api/access/documents/${documentId}/stream?token=${token}`;

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      url,
    };
  }

  async createDownloadToken(
    userId: string,
    userRole: string,
    documentId: string,
  ): Promise<ProtectedDocumentUrlDto> {
    await this.ensureStaffSourceAccess(userId, userRole, documentId);

    const decision = await this.getAccessDecision(userId, userRole, documentId);
    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason || 'Access denied for document downloading');
    }

    const expiresAt = new Date(Date.now() + SOURCE_TOKEN_TTL_MS);
    const token = this.createSourceToken(userId, documentId, 'download', expiresAt);
    const url = `/api/access/documents/${documentId}/file?token=${token}`;

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      url,
    };
  }

  async getDocumentFile(
    userId: string,
    userRole: string,
    documentId: string,
    token: string,
    purpose: StaffFilePurpose,
  ) {
    await this.ensureStaffSourceAccess(userId, userRole, documentId);

    if (!this.isValidSourceToken(token, userId, documentId, purpose)) {
      throw new ForbiddenException('Invalid or expired document access token');
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

    const file = book.files.find((candidate) => candidate.status === 'ACTIVE') || book.files[0];
    if (!file) {
      throw new NotFoundException(`Document ${documentId} has no associated file`);
    }

    return file;
  }

  async getFileBuffer(bucket: string, objectKey: string): Promise<Buffer> {
    return this.storage.getObjectBuffer(bucket, objectKey);
  }

  private async recordDeniedAccessEvent(params: {
    userId: string;
    documentId: string;
    sessionId?: string;
    pageNumber?: number;
    reasonCode: ReaderAccessReasonCode;
    bookFileId?: string;
  }): Promise<void> {
    const riskLevel =
      params.reasonCode === ReaderAccessReasonCode.DOCUMENT_UNAVAILABLE
        ? ReaderAccessRiskLevel.LOW
        : ReaderAccessRiskLevel.MEDIUM;

    await this.auditService.recordEvent({
      eventType: ReaderAccessEventType.PAGE_DENIED,
      riskLevel,
      reasonCode: params.reasonCode,
      userId: params.userId,
      sessionId: params.sessionId,
      bookId: params.documentId,
      bookFileId: params.bookFileId,
      pageNumber: params.pageNumber,
      createdAt: new Date(),
    });
  }

  private async recordDependencyUnavailableEvent(input: {
    userId: string;
    documentId: string;
    sessionId?: string;
    bookFileId?: string;
    pageNumber?: number;
    createdAt: Date;
  }): Promise<void> {
    try {
      await this.auditService.recordEvent({
        eventType: ReaderAccessEventType.PAGE_DENIED,
        riskLevel: ReaderAccessRiskLevel.HIGH,
        reasonCode: ReaderAccessReasonCode.DEPENDENCY_UNAVAILABLE,
        userId: input.userId,
        sessionId: input.sessionId,
        bookId: input.documentId,
        bookFileId: input.bookFileId,
        pageNumber: input.pageNumber,
        createdAt: input.createdAt,
      });
    } catch {
      // Persisted-audit failure must still fail closed; the original request will be denied.
    }
  }

  private async ensureStaffSourceAccess(userId: string, userRole: string, documentId: string): Promise<void> {
    if (isStaffRole(userRole)) {
      return;
    }

    await this.recordDeniedAccessEvent({
      userId,
      documentId,
      reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
    });

    throw new ForbiddenException(STAFF_ONLY_SOURCE_MESSAGE);
  }

  private createSourceToken(
    userId: string,
    documentId: string,
    purpose: StaffFilePurpose,
    expiresAt: Date,
  ): string {
    if (!this.sourceTokenSecret) {
      throw new ServiceUnavailableException('Staff source access is not configured.');
    }
    const expiresAtMs = expiresAt.getTime();
    const nonce = randomBytes(16).toString('base64url');
    const payload = `v1.${purpose}.${expiresAtMs}.${nonce}`;
    const signature = createHmac('sha256', this.sourceTokenSecret)
      .update(`${payload}:${userId}:${documentId}`)
      .digest('base64url');
    return `${payload}.${signature}`;
  }

  private isValidSourceToken(
    token: string,
    userId: string,
    documentId: string,
    purpose: StaffFilePurpose,
  ): boolean {
    if (!this.sourceTokenSecret) return false;
    const [version, tokenPurpose, expiresAtValue, nonce, signature, ...extra] = token.split('.');
    if (
      extra.length > 0 ||
      version !== 'v1' ||
      tokenPurpose !== purpose ||
      !nonce ||
      !signature
    ) {
      return false;
    }
    const expiresAtMs = Number(expiresAtValue);
    if (!Number.isSafeInteger(expiresAtMs) || expiresAtMs <= Date.now()) {
      return false;
    }
    const payload = `${version}.${tokenPurpose}.${expiresAtValue}.${nonce}`;
    const expected = createHmac('sha256', this.sourceTokenSecret)
      .update(`${payload}:${userId}:${documentId}`)
      .digest();
    const actual = Buffer.from(signature, 'base64url');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
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

    const file = book.files.find((candidate) => candidate.status === 'ACTIVE') || book.files[0];
    if (!file) {
      throw new NotFoundException(`Document ${documentId} has no associated file`);
    }

    return file;
  }
}

function isStaffRole(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'LIBRARIAN';
}

function denialReasonCode(documentStatus: string | undefined): ReaderAccessReasonCode {
  return documentStatus === 'PUBLISHED'
    ? ReaderAccessReasonCode.ACCESS_DENIED
    : ReaderAccessReasonCode.DOCUMENT_UNAVAILABLE;
}

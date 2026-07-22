import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentUrlDto } from './dto/protected-document-url.dto';

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
  constructor(private readonly prisma: PrismaService) {}

  async getAccessDecision(userId: string, userRole: string, documentId: string): Promise<AccessDecisionDto> {
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

    const reason = READER_DENIAL_REASONS[book.status] ?? 'Document is not available for reading.';

    return {
      allowed: false,
      documentId,
      userRole,
      documentStatus: book.status,
      reason,
    };
  }

  async createViewToken(userId: string, userRole: string, documentId: string): Promise<ProtectedDocumentUrlDto> {
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

  async createDownloadToken(userId: string, userRole: string, documentId: string): Promise<ProtectedDocumentUrlDto> {
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
}

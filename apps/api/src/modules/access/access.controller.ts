import { Controller, Get, HttpCode, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccessService } from './access.service';
import { AccessDecisionDto } from './dto/access-decision.dto';
import { ProtectedDocumentUrlDto } from './dto/protected-document-url.dto';

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
}

import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BookmarkDto } from './dto/bookmark.dto';
import { ReaderLibraryItemDto, ReaderLibraryResponseDto, ReadingProgressStateDto } from './dto/reader-library-item.dto';
import { ReaderLibraryQueryDto } from './dto/reader-library-query.dto';
import { ReadingProgressDto } from './dto/reading-progress.dto';
import { ReaderService } from './reader.service';

@ApiTags('Reader')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('READER', 'LIBRARIAN', 'ADMIN')
@Controller('reader')
export class ReaderController {
  constructor(@Inject(ReaderService) private readonly readerService: ReaderService) {}

  @Get('library')
  @ApiOperation({ summary: 'Get reader library items with progress and bookmark status.' })
  @ApiOkResponse({ type: ReaderLibraryResponseDto })
  getLibrary(
    @CurrentUser() user: SessionUserDto,
    @Query() query: ReaderLibraryQueryDto,
  ): Promise<ReaderLibraryResponseDto> {
    return this.readerService.getLibrary(user.id, query);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get reader recent reading history.' })
  @ApiOkResponse({ type: [ReaderLibraryItemDto] })
  getHistory(@CurrentUser() user: SessionUserDto): Promise<ReaderLibraryItemDto[]> {
    return this.readerService.getHistory(user.id);
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get reader bookmarked documents.' })
  @ApiOkResponse({ type: [ReaderLibraryItemDto] })
  getBookmarks(@CurrentUser() user: SessionUserDto): Promise<ReaderLibraryItemDto[]> {
    return this.readerService.getBookmarks(user.id);
  }

  @Post('bookmarks')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add a document bookmark for current reader.' })
  @ApiOkResponse({ description: 'Bookmark saved successfully.' })
  addBookmark(
    @CurrentUser() user: SessionUserDto,
    @Body() dto: BookmarkDto,
  ): Promise<{ success: boolean; documentId: string }> {
    return this.readerService.addBookmark(user.id, dto);
  }

  @Delete('bookmarks/:documentId')
  @ApiOperation({ summary: 'Remove a document bookmark for current reader.' })
  @ApiOkResponse({ description: 'Bookmark removed successfully.' })
  removeBookmark(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
  ): Promise<{ success: boolean; documentId: string }> {
    return this.readerService.removeBookmark(user.id, documentId);
  }

  @Patch('progress/:documentId')
  @ApiOperation({ summary: 'Update reading progress for a document.' })
  @ApiOkResponse({ type: ReadingProgressStateDto })
  updateProgress(
    @CurrentUser() user: SessionUserDto,
    @Param('documentId') documentId: string,
    @Body() dto: ReadingProgressDto,
  ): Promise<ReadingProgressStateDto> {
    return this.readerService.updateProgress(user.id, documentId, dto);
  }
}

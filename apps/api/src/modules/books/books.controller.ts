import { BadRequestException, Body, Controller, Get, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MAX_PDF_SIZE_BYTES } from '../storage/pdf-validation';
import { BooksService } from './books.service';
import { CreateBookIntakeResponseDto } from './dto/book-intake-response.dto';
import { CreateBookIntakeDto } from './dto/create-book-intake.dto';
import { AdminBookListItemResponseDto } from '../catalog/dto/catalog-response.dto';

@ApiTags('Admin Books')
@Controller('admin/books')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN')
export class BooksController {
  constructor(@Inject(BooksService) private readonly books: BooksService) {}

  @Post('intake')
  @ApiOperation({ summary: 'Create a digital book intake and queue processing.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'metadata'],
      properties: {
        file: { type: 'string', format: 'binary' },
        metadata: { type: 'string', description: 'JSON string matching CreateBookIntakeDto.' }
      }
    }
  })
  @ApiCreatedResponse({ type: CreateBookIntakeResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE_BYTES } }))
  async createIntake(@UploadedFile() file: Express.Multer.File, @Body('metadata') metadata: string, @CurrentUser() user: SessionUserDto) {
    const parsed = await this.parseMetadata(metadata);
    return this.books.createIntake(parsed, file, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'List digital book intake records for staff.' })
  @ApiOkResponse({ type: [AdminBookListItemResponseDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  listAdminBooks() {
    return this.books.listAdminBooks();
  }

  private async parseMetadata(metadata: string): Promise<CreateBookIntakeDto> {
    if (!metadata) {
      throw new BadRequestException('metadata JSON field is required.');
    }
    let raw: unknown;
    try {
      raw = JSON.parse(metadata);
    } catch {
      throw new BadRequestException('metadata must be valid JSON.');
    }
    const dto = plainToInstance(CreateBookIntakeDto, raw);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.flatMap((error) => Object.values(error.constraints ?? {})).join('; '));
    }
    return dto;
  }
}

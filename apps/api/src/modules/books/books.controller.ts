import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MAX_PDF_SIZE_BYTES } from '../storage/pdf-validation';
import { BooksService } from './books.service';
import { CreateBookIntakeDto } from './dto/create-book-intake.dto';

@Controller('admin/books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Post('intake')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE_BYTES } }))
  async createIntake(@UploadedFile() file: Express.Multer.File, @Body('metadata') metadata: string) {
    const parsed = await this.parseMetadata(metadata);
    return this.books.createIntake(parsed, file);
  }

  @Get()
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

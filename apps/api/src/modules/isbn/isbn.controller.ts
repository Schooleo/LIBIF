import { Controller, Get, Param } from '@nestjs/common';
import { IsbnService } from './isbn.service';

@Controller('isbn')
export class IsbnController {
  constructor(private readonly isbn: IsbnService) {}

  @Get(':isbn')
  lookup(@Param('isbn') isbn: string) {
    return this.isbn.lookup(isbn);
  }
}

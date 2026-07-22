import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { CategoriesController } from './categories.controller';
import { TagsController } from './tags.controller';
import { TaxonomyService } from './taxonomy.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [CategoriesController, TagsController],
  providers: [TaxonomyService],
  exports: [TaxonomyService]
})
export class TaxonomyModule {}

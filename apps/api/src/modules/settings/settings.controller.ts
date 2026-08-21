import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GeneralSettingsResponseDto, UpdateGeneralSettingsDto } from './dto/settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Admin Settings')
@Controller('admin/settings/general')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class SettingsController {
  constructor(@Inject(SettingsService) private readonly settings: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Return product-owned settings and safe read-only deployment metadata.' })
  @ApiOkResponse({ type: GeneralSettingsResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  getGeneralSettings(): Promise<GeneralSettingsResponseDto> {
    return this.settings.getGeneralSettings();
  }

  @Patch()
  @ApiOperation({ summary: 'Update product-owned general settings.' })
  @ApiOkResponse({ type: GeneralSettingsResponseDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  updateGeneralSettings(
    @Body() input: UpdateGeneralSettingsDto,
    @CurrentUser() actor: SessionUserDto
  ): Promise<GeneralSettingsResponseDto> {
    return this.settings.updateGeneralSettings(input, actor.id);
  }
}

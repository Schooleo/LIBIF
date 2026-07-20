import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { SessionDto } from './dto/session.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Get('session')
  @ApiOperation({ summary: 'Return the current session boundary state.' })
  @ApiOkResponse({ type: SessionDto })
  getSession(@Req() request: Request): SessionDto {
    return this.auth.getSession(request);
  }
}

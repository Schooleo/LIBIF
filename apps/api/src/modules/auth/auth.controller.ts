import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthMessageDto, PasswordResetDto, PasswordResetRequestDto, RegisterRequestDto, SignInRequestDto } from './dto/auth-requests.dto';
import { AuthErrorDto, SessionDto } from './dto/session.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a reader account and start a session.' })
  @ApiCreatedResponse({ type: SessionDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  register(@Body() dto: RegisterRequestDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SessionDto> {
    return this.auth.register(dto, request, response);
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in with email and password.' })
  @ApiOkResponse({ type: SessionDto })
  @ApiUnauthorizedResponse({ type: AuthErrorDto })
  signIn(@Body() dto: SignInRequestDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SessionDto> {
    return this.auth.signIn(dto, request, response);
  }

  @Post('sign-out')
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke the current session and clear the session cookie.' })
  @ApiOkResponse({ type: AuthMessageDto })
  signOut(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AuthMessageDto> {
    return this.auth.signOut(request, response);
  }

  @Get('session')
  @ApiOperation({ summary: 'Return the current session boundary state.' })
  @ApiOkResponse({ type: SessionDto })
  getSession(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SessionDto> {
    return this.auth.getSession(request, response);
  }

  @Post('password-reset-requests')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request a password reset link if an account exists.' })
  @ApiOkResponse({ type: AuthMessageDto })
  requestPasswordReset(@Body() dto: PasswordResetRequestDto, @Req() request: Request): Promise<AuthMessageDto> {
    return this.auth.requestPasswordReset(dto, request);
  }

  @Post('password-resets')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset a password with a valid reset token.' })
  @ApiOkResponse({ type: AuthMessageDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  resetPassword(@Body() dto: PasswordResetDto): Promise<AuthMessageDto> {
    return this.auth.resetPassword(dto);
  }
}

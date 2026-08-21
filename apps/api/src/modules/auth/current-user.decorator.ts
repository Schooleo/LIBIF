import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SessionUserDto } from './dto/session.dto';

export type AuthenticatedRequest = Request & { user?: SessionUserDto };

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): SessionUserDto | undefined => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
});

import { Module } from '@nestjs/common';
import { AuthCookieService } from './auth-cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';
import { PasswordHasher } from './password-hasher.service';
import { PasswordResetDeliveryService } from './password-reset-delivery.service';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, PasswordHasher, AuthTokenService, AuthCookieService, PasswordResetDeliveryService],
  exports: [AuthService, RolesGuard, PasswordHasher, AuthTokenService, AuthCookieService, PasswordResetDeliveryService]
})
export class AuthModule {}

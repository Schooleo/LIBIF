import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export type PasswordResetDelivery = {
  email: string;
  token: string;
  resetUrl: string;
  createdAt: Date;
};

@Injectable()
export class PasswordResetDeliveryService {
  private readonly logger = new Logger(PasswordResetDeliveryService.name);
  private readonly deliveries: PasswordResetDelivery[] = [];

  constructor(private readonly config: ConfigService) {}

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const appUrl = this.config.get<string>('LIBIF_WEB_BASE_URL') ?? 'http://localhost:3000';
    const resetUrl = `${appUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
    const smtp = this.smtpConfiguration();
    if (smtp) {
      try {
        await nodemailer.createTransport(smtp).sendMail({
          from: smtp.from,
          to: email,
          subject: 'Reset your LIBIF password',
          text: `We received a request to reset your LIBIF password.\n\nUse this one-time link to choose a new password:\n${resetUrl}\n\nIf you did not request this change, you can ignore this email.`
        });
        this.logger.log(`Password reset email accepted by SMTP for ${email}.`);
        return;
      } catch (error) {
        this.logger.error(`Password reset email delivery failed for ${email}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    if (this.config.get<string>('NODE_ENV') !== 'production') {
      const delivery = { email, token, resetUrl, createdAt: new Date() };
      this.deliveries.push(delivery);
      this.logger.log(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }
    this.logger.error('Password reset email delivery is unavailable: configure SMTP_HOST, SMTP_USERNAME, and SMTP_PASSWORD.');
  }

  getLatestDelivery(email?: string): PasswordResetDelivery | undefined {
    const candidates = email ? this.deliveries.filter((delivery) => delivery.email === email) : this.deliveries;
    return candidates[candidates.length - 1];
  }

  clearDeliveries(): void {
    this.deliveries.length = 0;
  }

  private smtpConfiguration(): (SMTPTransport.Options & { from: string }) | undefined {
    const host = this.config.get<string>('SMTP_HOST')?.trim();
    const user = this.config.get<string>('SMTP_USERNAME')?.trim();
    const rawPassword = this.config.get<string>('SMTP_PASSWORD');
    if (!host || !user || !rawPassword) return undefined;
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    const secureMode = this.config.get<string>('SMTP_SECURE')?.trim().toLowerCase();
    const secure = secureMode === 'ssl' || port === 465;
    const password = host.toLowerCase() === 'smtp.gmail.com' ? rawPassword.replace(/\s/g, '') : rawPassword;
    return {
      host,
      port: Number.isInteger(port) && port > 0 ? port : 587,
      secure,
      requireTLS: !secure && secureMode !== 'none',
      auth: { user, pass: password },
      from: this.config.get<string>('SMTP_FROM')?.trim() || user
    };
  }
}

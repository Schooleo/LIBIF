import { Injectable, Logger } from '@nestjs/common';

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

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const appUrl = process.env.LIBIF_WEB_BASE_URL ?? 'http://localhost:3000';
    const resetUrl = `${appUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
    if (process.env.NODE_ENV !== 'production') {
      const delivery = { email, token, resetUrl, createdAt: new Date() };
      this.deliveries.push(delivery);
      this.logger.log(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }
    this.logger.warn('Password reset delivery provider is not configured; set a production mail adapter before enabling password reset email delivery.');
  }

  getLatestDelivery(email?: string): PasswordResetDelivery | undefined {
    const candidates = email ? this.deliveries.filter((delivery) => delivery.email === email) : this.deliveries;
    return candidates[candidates.length - 1];
  }

  clearDeliveries(): void {
    this.deliveries.length = 0;
  }
}

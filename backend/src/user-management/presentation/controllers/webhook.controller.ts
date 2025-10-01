import { Controller, Logger, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from 'src/user-management/application/services/webhook.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly webhookService: WebhookService) {}

  @Post('auth')
  async handleAuthWebhook(@Req() req: Request) {
    this.logger.log(
      'WebhookController ~ handleAuthWebhook ~ auth: Incoming request',
    );

    await this.webhookService.processAuthWebhook(req);
    return { status: 'ok' };
  }
}

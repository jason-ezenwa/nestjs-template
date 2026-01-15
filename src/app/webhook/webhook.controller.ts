import {
  Controller,
  Post,
  Req,
  Headers,
  type RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('stripe')
  @AllowAnonymous()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new Error('Raw body not available');
    }

    await this.webhookService.handleStripeWebhook(rawBody, signature);

    return { received: true };
  }
}

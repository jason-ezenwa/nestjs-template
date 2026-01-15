import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { StripeModule } from '../stripe/stripe.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [StripeModule, EventsModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

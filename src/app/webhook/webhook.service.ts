import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  /**
   * In-memory idempotency cache for processed Stripe events.
   *
   * Trade-offs:
   * - Lost on server restart, potentially reprocessing events
   * - Not distributed across multiple server instances
   *
   * This is acceptable for MVP because:
   * 1. Stripe rarely retries webhooks unless they fail (we always return 200)
   * 2. The payment status update is idempotent (setting status to PAID twice is safe)
   * 3. Order status transitions are guarded (PENDING → AWAITING_MATERIAL only happens once)
   *
   * For later scale, consider:
   * - Redis with TTL for distributed idempotency
   * - MongoDB collection with TTL index on processed event IDs
   */
  private readonly processedEventIds = new Set<string>();

  constructor(
    private stripeService: StripeService,
  ) {}

  async handleStripeWebhook(payload: Buffer, signature: string): Promise<void> {
    this.logger.log('Processing Stripe webhook');

    let event: Stripe.Event;

    try {
      event = this.stripeService.verifyWebhookSignature(payload, signature);
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error.stack);
      throw error;
    }

    // Idempotency check
    if (this.processedEventIds.has(event.id)) {
      this.logger.log(`Event ${event.id} already processed, skipping`);
      return;
    }

    this.logger.log(`Processing Stripe event: ${event.type}`, {
      eventId: event.id,
    });

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event);
        break;
      case 'checkout.session.expired':
        await this.handleCheckoutSessionExpired(event);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    // Mark as processed
    this.processedEventIds.add(event.id);
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.Event,
  ): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const { transactionReference } = session.metadata || {};

    this.logger.log('Checkout session completed', {
      transactionReference,
      sessionId: session.id,
    });

  }

  private async handleCheckoutSessionExpired(
    event: Stripe.Event,
  ): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const { transactionReference } = session.metadata || {};

    this.logger.log('Checkout session expired', {
      sessionId: session.id,
      transactionReference,
    });
  }
}

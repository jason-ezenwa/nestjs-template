import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionParams, CheckoutSessionResult } from './types';

export * from './types';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSessionResult> {
    this.logger.log('Creating Stripe checkout session', {
      amount: params.amount,
      currency: params.currency,
    });

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: params.currency.toLowerCase(),
              product_data: {
                name: params.description || 'Payment',
              },
              unit_amount: Math.round(params.amount * 100), // Stripe expects lowest currency unit e.g kobo/cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          transactionReference: params.transactionReference,
        },
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer_email: params.customerEmail,
      });

      this.logger.log('Created Stripe checkout session', {
        sessionId: session.id,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url!,
      };
    } catch (error) {
      this.logger.error(
        'Failed to create Stripe checkout session',
        error.stack,
      );
      throw error;
    }
  }

  verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}

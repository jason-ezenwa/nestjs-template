export const Events = {
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  WEBHOOK_RECEIVED: 'webhook.received',
} as const;

export type EventName = (typeof Events)[keyof typeof Events];

export interface PaymentSucceededPayload {
  orderId: string;
  paymentId: string;
  transactionId: string;
  transactionReference: string;
}

export interface PaymentFailedPayload {
  orderId: string;
  paymentId: string;
  transactionReference: string;
  error?: string;
}

export interface WebhookReceivedPayload {
  provider: string;
  eventType: string;
  eventId: string;
  data: any;
}

export type EventPayloadMap = {
  [Events.PAYMENT_SUCCEEDED]: PaymentSucceededPayload;
  [Events.PAYMENT_FAILED]: PaymentFailedPayload;
  [Events.WEBHOOK_RECEIVED]: WebhookReceivedPayload;
};

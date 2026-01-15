export interface CreateCheckoutSessionParams {
  transactionReference: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  description?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

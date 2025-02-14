import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('pk_test_51QsUEH4EVocvDj3NdEhx7GZqGRymZ9Ic7W3xZnTq5PHam6wLarYbc4PH6Q6lLZmvqZGNLkH9f4haVUU4CdyA2py3007lK8wTbv');
  }

  async checkout(lineItems: any[]) {
    const stripe = await this.stripePromise;
    if (stripe) {
      const session = await this.http.post<{ id: string }>('localhost:8082/api/stripe/create-checkout-session', lineItems).toPromise();
      if(session && session.id) {
        await stripe.redirectToCheckout({ sessionId: session?.id });
      }

    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StripeModule } from '../../stripe/stripe.module';
import { API_URL } from '../../../config';
import { ServiceDTO } from '../../services/models/service.dto';
import { CartService } from '../../services/cart.service';
import { PlatformService } from '../../services/platform.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    MatLabel,
    HttpClientModule,
    StripeModule,
    CurrencyPipe,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    NgIf,
    RouterLink,
    AsyncPipe,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  cartItems$: Observable<ServiceDTO[]>;
  totalPrice: number = 0;
  quantities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private stripeService: StripeService,
    private http: HttpClient,
    private platformService: PlatformService
  ) {
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(items => {
      items.forEach(item => item.quantity = item.quantity || 1);
      this.updateTotalPrice();
    });
  }

  updateTotalPrice(): void {
    this.cartItems$.subscribe(items => {
      this.totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });
  }

  removeFromCart(service: ServiceDTO): void {
    this.cartService.removeFromCart(service);
    this.updateTotalPrice();
  }

  async completeOrder() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      this.cartItems$.subscribe(items => {
        const lineItems = items.map(item => ({
          title: item.title,
          description: item.description,
          price: item.price,
          quantity: item.quantity
        }));

        this.http.post(`${API_URL}/api/stripe/create-checkout-session`, lineItems)
          .subscribe({
            next: (session: any) => {
              this.stripeService.redirectToCheckout({ sessionId: session.id })
                .subscribe({
                  next: (result) => {
                    if (result.error) {
                      console.error('Error redirecting to Stripe:', result.error.message);
                      this.isProcessing = false;
                    }
                  },
                  error: (error) => {
                    console.error('Stripe redirect error:', error);
                    this.isProcessing = false;
                  }
                });
            },
            error: (error) => {
              console.error('Session creation error:', error);
              this.isProcessing = false;
            }
          });
      });
    } catch (error) {
      console.error('Order processing error:', error);
      this.isProcessing = false;
    }
  }

  getItemSubtotal(item: ServiceDTO): number {
    return item.price * (item.quantity || 1);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceDTO } from './models/service.dto';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: ServiceDTO[] = [];
  private cartItemsSubject = new BehaviorSubject<ServiceDTO[]>([]);

  constructor(private platformService: PlatformService) {
    this.loadCartFromSessionStorage();
  }

  private loadCartFromSessionStorage(): void {
    const storedItems = this.platformService.getSessionStorageItem('cartItems');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private updateSessionStorage(): void {
    this.platformService.setSessionStorageItem('cartItems', JSON.stringify(this.cartItems));
  }

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(service: ServiceDTO): void {
    this.cartItems.push(service);
    this.cartItemsSubject.next(this.cartItems);
    this.updateSessionStorage();
  }

  removeFromCart(service: ServiceDTO): void {
    this.cartItems = this.cartItems.filter(item => item.id !== service.id);
    this.cartItemsSubject.next(this.cartItems);
    this.updateSessionStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    this.updateSessionStorage();
  }
}

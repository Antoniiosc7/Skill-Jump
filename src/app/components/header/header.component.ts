import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import {CartService} from '../../services/cart.service';
import { ServiceDTO} from '../../services/models/service.dto';
import {Observable} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgIf,
    MatIcon,
    AsyncPipe,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    NgForOf,
    MatMenuTrigger,
    MatButton
  ],
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;
  cartItems$: Observable<ServiceDTO[]>;

  constructor(    private cartService: CartService,
                  private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.cartItems$ = this.cartService.getCartItems();

  }

  ngOnInit() {
    this.updateAuthStatus();
    this.authService.authStatusChanged.subscribe(status => {
      this.updateAuthStatus();
    });
  }

  removeFromCart(service: ServiceDTO) {
    this.cartService.removeFromCart(service);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    if (this.isLoggedIn) {
      this.router.navigate(['/check-out']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }
  updateAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUsername();
    this.cdr.detectChanges();
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToProfile() {
    if (this.username) {
      this.router.navigate([`/profile/${this.username}`]);
    }
  }

  logout() {
    this.authService.clearSessionData();
    this.router.navigate(['/login']);
  }
}

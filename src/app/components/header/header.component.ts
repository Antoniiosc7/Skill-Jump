import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [
        NgIf
    ],
    standalone: true,
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false; // This should be set based on your authentication logic

  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

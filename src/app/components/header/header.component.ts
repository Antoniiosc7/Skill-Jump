import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgIf
  ],
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateAuthStatus();
    this.authService.authStatusChanged.subscribe(status => {
      this.updateAuthStatus();
    });
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

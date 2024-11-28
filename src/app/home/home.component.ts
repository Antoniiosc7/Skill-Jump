import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgClass,
    HeaderComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLoggedIn = false; // This should be set based on your authentication logic

  constructor(private router: Router) {}

  navigateToGame() {
    this.router.navigate(['/game']);
  }

  navigateToMultiplayer() {
    this.router.navigate(['/multiplayer']);
  }

}

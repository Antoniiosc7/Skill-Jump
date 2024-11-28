import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    HeaderComponent
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router: Router) {}

  register() {
    // Implement register logic here
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

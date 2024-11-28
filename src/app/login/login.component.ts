import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    HeaderComponent
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    // Implement login logic here
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

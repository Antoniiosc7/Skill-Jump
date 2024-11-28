import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  standalone: true,
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  standalone: true,
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

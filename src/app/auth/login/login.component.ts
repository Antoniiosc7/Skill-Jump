import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../services/models/login-dto.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}

  login() {
    const loginDto: LoginDto = {
      username: this.username,
      password: this.password
    };

    this.apiService.login(loginDto).subscribe(
      response => {
        console.log('Login successful', response);
        this.authService.setSessionData(this.username, response.token);
        const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

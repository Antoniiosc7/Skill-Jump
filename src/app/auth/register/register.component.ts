import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { RegisterDto } from '../../services/models/register-dto.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  username: string = '';
  password: string = '';
  mail: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  register() {
    const registerDto: RegisterDto = {
      nombre: this.nombre,
      apellido: this.apellido,
      username: this.username,
      password: this.password,
      mail: this.mail,
      profileImg: ''
    };

    this.apiService.register(registerDto).subscribe(
      response => {
        // Handle registration response
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

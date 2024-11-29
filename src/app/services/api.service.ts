import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';
import { RegisterDto } from './models/register-dto.model';
import { LoginDto } from './models/login-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${API_URL}/api/auth`;

  constructor(private http: HttpClient) { }

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginDto);
  }

  register(registerDto: RegisterDto): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json'
    };

    return this.http.post(`${this.baseUrl}/register`, registerDto, httpOptions);
  }
}

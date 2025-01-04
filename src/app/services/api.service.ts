import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';
import { RegisterDto } from './models/register-dto.model';
import { LoginDto } from './models/login-dto.model';
import { UserScore } from './models/user-score-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${API_URL}/api/auth`;
  private scoresUrl = `${API_URL}/api/scores`;
  private atributos = `${API_URL}/api/user-attributes`;

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

  postScore(username: string, score: number): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('score', score.toString());
    return this.http.post<string>(`${this.scoresUrl}/post`, null, { params });
  }

  getTop10Historical(): Observable<UserScore[]> {
    return this.http.get<UserScore[]>(`${this.scoresUrl}/top10historical`);
  }

  getTop10Month(): Observable<UserScore[]> {
    return this.http.get<UserScore[]>(`${this.scoresUrl}/top10month`);
  }

  getTop10User(username: string): Observable<UserScore[]> {
    console.log(username)
    const params = new HttpParams().set('username', username);
    return this.http.get<UserScore[]>(`${this.scoresUrl}/top10user`, { params });
  }

  changeSelectedSkin(username: string, skin: string): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('skin', skin);
    return this.http.post<string>(`${this.atributos}/change-skin`, null, { params });
  }

  getSelectedSkin(username: string): Observable<string> {
    const params = new HttpParams().set('username', username);
    return this.http.get(`${this.atributos}/current-skin`, { params, responseType: 'text' });
  }
}

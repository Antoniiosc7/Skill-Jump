import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionDataKey = 'sessionData';
  authStatusChanged = new EventEmitter<boolean>();

  constructor() {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.sessionDataKey);
  }

  getUsername(): string | null {
    const sessionData = sessionStorage.getItem(this.sessionDataKey);
    return sessionData ? JSON.parse(sessionData).username : null;
  }

  getToken(): string | null {
    const sessionData = sessionStorage.getItem(this.sessionDataKey);
    return sessionData ? JSON.parse(sessionData).token : null;
  }

  setSessionData(username: string, token: string): void {
    sessionStorage.setItem(this.sessionDataKey, JSON.stringify({ username, token }));
    this.authStatusChanged.emit(true);
  }

  clearSessionData(): void {
    sessionStorage.removeItem(this.sessionDataKey);
    this.authStatusChanged.emit(false);
  }
}

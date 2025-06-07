import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment';

interface AuthResponse {
  token: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    console.log(
     this.http.post<AuthResponse>(this.apiUrl, { email, password }));
    return this.http.post<AuthResponse>(this.apiUrl, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('פענוח הטוקן:', decodedPayload);

      return decodedPayload['http://schemas.microsoft.com/ws/2008                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             /06/identity/claims/role'] || null; // בדקי אם זה באמת בשם role
    } catch (error) {
      console.error('שגיאה בפענוח הטוקן:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}

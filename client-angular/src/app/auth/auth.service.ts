import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // הוספתי ייבוא עבור Router
import { environment } from '../../environment';

interface AuthResponse {
  token: string; // או מבנה התגובה מה-API שלך
  // יכולים להיות שדות נוספים כמו userId, שם מלא וכו'
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`; // החלף בכתובת ה-API שלך להתחברות

  constructor(private http: HttpClient, private router: Router) {} // הזרקתי את Router

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, password });
  }

  // מתודות נוספות לשמירת טוקן, בדיקת סטטוס התחברות וכו'
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']); // כעת ניתן להשתמש ב-router
  }
}
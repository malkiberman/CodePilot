import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt'; // דוגמה לספרייה לעבודה עם JWT


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService // ודאי שהגדרת את הספרייה הזו
  ) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // מפתח הקליימ של הרול עשוי להיות שונה

      if (role === 'Admin') {
        return true; // המשתמש הוא מנהל ויכול לגשת
      } else {
        this.router.navigate(['/login']); // אין הרשאה
        return false;
      }
    } else {
      this.router.navigate(['/login']); // אין טוקן או שהוא פג תוקף
      return false;
    }
  }
}
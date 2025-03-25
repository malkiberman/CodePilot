import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // שינוי ל-email והוספת ולידציה
    password: new FormControl('', [Validators.required]),
  });

  loading = false;
  loginError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginError = null;
      const { email, password } = this.loginForm.value; // שינוי ל-email
      this.authService.login(email!, password!).subscribe({ // שינוי ל-email
        next: (response) => {
          this.authService.saveToken(response. token); // שמירת הטוקן מהתגובה

          this.loading = false;
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.loading = false;
          this.loginError = 'שם משתמש או סיסמה שגויים.';
          if (error?.error?.message) {
            this.loginError = error.error.message; // הצגת הודעת שגיאה מהשרת אם קיימת
          }
          this.snackBar.open(this.loginError||"", 'סגור', { duration: 3000 });
          this.loginForm.reset();
        },
      });
    }
  }
}
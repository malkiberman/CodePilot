import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './app/auth/auth.guard';
import { AuthService } from './app/auth/auth.service';
import { UserService } from './app/users/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './environment'; // ייבוא environment

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    AuthGuard,
    AuthService,
    UserService,
    JwtHelperService,
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => { // שימוש בפונקציית חץ
            return localStorage.getItem('authToken');
          },
          allowedDomains: [environment.apiUrl], // שימוש ב-environment
          disallowedRoutes: [`${environment.apiUrl}/auth/login`], // שימוש ב-environment
        },
      })
    ),
  ],
}).catch((err) => console.error(err));
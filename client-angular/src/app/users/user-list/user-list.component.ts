import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; // נתיב לשירות המשתמשים שלך


import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user.model';
@Component({
    selector: 'app-user-list',
    imports: [
        CommonModule,
        MatExpansionModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (users:User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (error:any) => {
        this.error = 'שגיאה בטעינת המשתמשים.';
        this.loading = false;
        console.error(error);
        this.snackBar.open(this.error, 'סגור', { duration: 3000 });
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      this.loading = true;
      this.error = null;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('המשתמש נמחק בהצלחה.', 'סגור', { duration: 3000 });
          this.loadUsers(); // רענון רשימת המשתמשים
          this.loading = false;
        },
        error: (error:any) => {
          this.error = 'שגיאה במחיקת המשתמש.';
          this.loading = false;
          console.error(error);
          this.snackBar.open(this.error, 'סגור', { duration: 3000 });
        },
      });
    }
  }
}
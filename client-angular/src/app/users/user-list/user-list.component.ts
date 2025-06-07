import { Component, type OnInit } from "@angular/core"
import  { UserService } from "../user.service"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatListModule } from "@angular/material/list"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { CommonModule } from "@angular/common"
import  { MatSnackBar } from "@angular/material/snack-bar"
import type { User } from "../user.model"

@Component({
  selector: "app-user-list",
  imports: [CommonModule, MatExpansionModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  users: User[] = []
  loading = false
  error: string | null = null

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.loading = true
    this.error = null
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users
        this.loading = false
      },
      error: (error: any) => {
        this.error = "Error loading users."
        this.loading = false
        console.error(error)
        this.snackBar.open(this.error, "Close", { duration: 3000 })
      },
    })
  }

  deleteUser(userId: number): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.loading = true
      this.error = null
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open("User deleted successfully.", "Close", { duration: 3000 })
          this.loadUsers()
          this.loading = false
        },
        error: (error: any) => {
          this.error = "Error deleting user."
          this.loading = false
          console.error(error)
          this.snackBar.open(this.error, "Close", { duration: 3000 })
        },
      })
    }
  }

  getUserInitials(username: string): string {
    if (!username) return "?"
    const words = username.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return username.substring(0, 2).toUpperCase()
  }

  getActiveUsersCount(): number {
    // Assuming all users are active - can be changed according to your logic
    return this.users.length
  }

  getRecentUsersCount(): number {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return this.users.filter((user) => {
      if (!user.created_at) return false
      const createdDate = new Date(user.created_at)
      return createdDate >= oneWeekAgo
    }).length
  }
}

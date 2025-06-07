import type { Routes } from "@angular/router"
import { LoginComponent } from "./auth/login/login.component"
import { UserListComponent } from "./users/user-list/user-list.component"
import { ReportsComponent } from "./reports/reports.component"
import { HomeComponent } from "./home/home.component"

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "users", component: UserListComponent },
  { path: "reports", component: ReportsComponent },
]

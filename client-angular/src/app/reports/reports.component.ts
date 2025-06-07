import { Component, type OnInit } from "@angular/core"
import { ReportsService } from "./report.service"
import { CommonModule } from "@angular/common"
import { NgxChartsModule, type Color, ScaleType } from "@swimlane/ngx-charts"
import { MatButtonModule } from "@angular/material/button"

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatButtonModule],
  providers: [ReportsService],
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  reportData: any[] = []
  loading = false
  error = ""

  colorScheme: Color = {
    domain: ["#9c27b0", "#00e676", "#673ab7", "#4caf50"],
    name: "custom",
    selectable: false,
    group: ScaleType.Ordinal,
  }

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReport()
  }

  customTooltipText(model: any): string {
    const users = model.extra?.users || []
    return `
      ${model.name}
      Logged in: ${model.value} users
      Users: ${users.join(", ")}
    `
  }

  loadReport() {
    this.loading = true
    this.error = ""

    const fromDate = new Date()
    fromDate.setMonth(fromDate.getMonth() - 1) // One month back
    const toDate = new Date()

    this.reportsService.getActiveUsersReport(fromDate, toDate).subscribe({
      next: (data: any[]) => {
        const grouped = data.reduce((acc: Record<string, any>, item: any) => {
          const date = new Date(item.lastLogin).toLocaleDateString()
          if (!acc[date]) {
            acc[date] = { count: 0, users: [] }
          }
          acc[date].count++
          acc[date].users.push(item.username)
          return acc
        }, {})

        this.reportData = Object.entries(grouped).map(([date, { count, users }]) => ({
          name: `${date}`,
          value: count,
          extra: { users },
        }))

        this.loading = false
      },
      error: () => {
        this.error = "Error loading reports"
        this.loading = false
      },
    })
  }

  getTotalLogins(): number {
    return this.reportData.reduce((total, item) => total + item.value, 0)
  }

  onChartSelect(event: any): void {
    console.log("Chart item selected:", event)
  }

  getAdditionalStats() {
    const totalLogins = this.getTotalLogins()
    const avgDaily = totalLogins / (this.reportData.length || 1)

    return [
      {
        title: "Daily Average",
        value: Math.round(avgDaily).toString(),
        change: "+12%",
        trend: "positive",
        icon: "📈",
        color: "green",
      },
      {
        title: "Peak Logins",
        value: Math.max(...this.reportData.map((d) => d.value), 0).toString(),
        change: "This week",
        trend: "neutral",
        icon: "🏆",
        color: "purple",
      },
      {
        title: "Active Days",
        value: this.reportData.length.toString(),
        change: `out of ${30}`,
        trend: "positive",
        icon: "📅",
        color: "green",
      },
    ]
  }
}

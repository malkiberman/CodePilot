import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportData: any[] = [];
  loading = false;
  error = '';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.loading = true;
    this.error = '';
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1); // לדוגמה: דיווח על חודש אחורה
    const toDate = new Date();

    this.reportsService.getActiveUsersReport(fromDate, toDate).subscribe({
      next: (data:any) => {
        this.reportData = data;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = 'שגיאה בטעינת הדוחות';
        this.loading = false;
      }
    });
  }
}

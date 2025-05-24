import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = `${environment.apiUrl}/admin`;  // ������ ���������� ��-API ������

  constructor(private http: HttpClient) {}

  getActiveUsersReport(from: Date, to: Date): Observable<any[]> {
    let params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());

    return this.http.get<any[]>(`${this.baseUrl}/active`, { params });
  }
}

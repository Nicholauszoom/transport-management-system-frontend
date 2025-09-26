import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MandateReportDto, ReportSummary } from '../app/report/mandate-report/mandate-report.component';
import { env } from '../constants/env.constant';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
 
 private mandateUri: string = env.baseUrl + '/api/mandate/report';

  constructor(private http: HttpClient) {}

  getReportSummary(startDate?: string, endDate?: string): Observable<ReportSummary> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get<ReportSummary>(`${this.mandateUri}/summary`, { params });
  }

  getSuccessMandatesReport(startDate?: string, endDate?: string, page: number = 0, size: number = 50): Observable<MandateReportDto[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get<MandateReportDto[]>(`${this.mandateUri}/success`, { params });
  }

  getFailedMandatesReport(startDate?: string, endDate?: string, page: number = 0, size: number = 50): Observable<MandateReportDto[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get<MandateReportDto[]>(`${this.mandateUri}/failed`, { params });
  }

  getAllMandatesReport(startDate?: string, endDate?: string, page: number = 0, size: number = 50): Observable<MandateReportDto[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get<MandateReportDto[]>(`${this.mandateUri}/all`, { params });
  }

  exportReport(reportType: string, format: string, startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams()
      .set('reportType', reportType)
      .set('format', format);
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get(`${this.mandateUri}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }
}
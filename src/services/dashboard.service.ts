import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, throwError } from 'rxjs';
import { DashbordDto } from '../dtos/dashbord.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { env } from '../constants/env.constant';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardUri: string = env.baseUrl + '/api/dashboard';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private statisticsSubject = new BehaviorSubject<DashbordDto[]>([]);
  statistics$ = this.statisticsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) { }

  getProgress() {
    return this.progressSubject.getValue();
  }

  setProgress(progress: boolean) {
    this.progressSubject.next(progress);
  }

setStatistics(statistics: DashbordDto[]) {
    this.statisticsSubject.next(statistics);
  }

  getStatistics() {
    return this.statisticsSubject.getValue();
  }


  getDashboardStats(): Observable<{ users: number; products: number; loans: number }> {
    // Mock API response
    return of({ users: 25, products: 3, loans: 500 });
  }

    // Original fetchStaictics method (kept for backward compatibility)
   fetchStatistics(page: number = 1, size: number = 10): Observable<{ statistics: DashbordDto; totalRecords: number }> {
  const url = `${this.dashboardUri}/statistics`;
  console.log('Fetching statistics from:', url);
  this.setProgress(true);

  return this.http.get<DashbordDto>(url, { withCredentials: true }).pipe(
    map((response) => {
      console.log('Statistics fetch response:', response);
      const statistics = response || {
        totalUsers: 0,
        totalMandates: 0,
        successMandates: 0,
        failedMandates: 0
      };
      const totalRecords = 1;
      this.setStatistics([statistics]); // Keep your existing setStatistics method happy
      return { statistics, totalRecords }; // Return single object, not array
    }),
    catchError((err) => {
      console.error('Statistics fetch error:', err);
      this.err.show(err);
      return throwError(() => err);
    }),
    finalize(() => {
      this.setProgress(false);
    })
  );
}
  
}
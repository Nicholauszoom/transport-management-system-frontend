import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogsDto } from '../dtos/logs.dto';
import { DataResponse } from '../dtos/api.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LogsServiceTsService {
  private url: string = env.baseUrl+"/api/portal/log/list";

  private logsSubject = new BehaviorSubject<LogsDto[]>([]);  
  logs$ = this.logsSubject.asObservable();


  getLogs(page: number, size: number): Observable<DataResponse> {
    return this.http.get<DataResponse>(`${this.url}?page=${page}&size=${size}`);
  }

  setLogs(logs: LogsDto[]) {  
    this.logsSubject.next(logs);
  }

  constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {
  }

  ngOnInit(): void {
    this.fetchLogs();
}


public fetchLogs(page: number = 1, size: number = 10) {
  this.getLogs(page, size).subscribe({
    next: res => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
      this.setLogs(res.data); // Assuming res.data contains the array of accounts
    },
    error: err => {
      this.err.show(err);
    }
  });
}
}

import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject } from 'rxjs';
import { LoanDto } from '../dtos/loan.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private url = `${env.baseUrl}/api/portal/loan/list`;

  private loansSubject = new BehaviorSubject<LoanDto[]>([]);
  loans$ = this.loansSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) {}

  getLoans(): LoanDto[] {
    return this.loansSubject.getValue();
  }

  setLoan(loans: LoanDto[]) {
    this.loansSubject.next(loans);
  }

  public fetchLoans(page: number = 1, size: number = 10) {
    this.http.get<DataResponse>(`${this.url}?page=${page}&size=${size}`, {withCredentials: true})
      .subscribe({
        next: res => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.setLoan(res.data); // Ensure this is the correct format for data
        },
        error: err => {
          this.err.show(err);
        }
      });
  }
}

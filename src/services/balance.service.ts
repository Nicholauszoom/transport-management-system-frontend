import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { ChargeDto } from '../dtos/charge.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';
import { BalanceDto } from '../dtos/balance.dto';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
 private balanceUri: string = env.baseUrl + '/api/balance';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private balanceSubject = new BehaviorSubject<BalanceDto[]>([]);
  balances$ = this.balanceSubject.asObservable();


  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) {}

  getProgress() {
    return this.progressSubject.getValue();
  }

  setProgress(progress: boolean) {
    this.progressSubject.next(progress);
  }

  setBalances (balances: BalanceDto[]) {
      this.balanceSubject.next(balances);
    }

  getBalances() {
    return this.balanceSubject.getValue();
  }

  fetchBalances(page: number = 1, size: number = 10): Observable<{ balances: BalanceDto[]; totalRecords: number }> {
    const url = `${this.balanceUri}/list?page=${page}&size=${size}`;
    console.log('Fetching balance from:', url);
    this.setProgress(true);
    return this.http.get<BalanceDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Balances fetch response:', response);
        const balances = response || [];
        const totalRecords = balances.length; // Fallback since no metadata from backend
        this.setBalances(balances);
        return { balances, totalRecords };
      }),
      
      catchError((err) => {
        console.error('balances fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

     getBalance(id: string): Observable<DataResponse> {
      this.setProgress(true);
      console.log('Fetching balances from:', `${this.balanceUri}/${id}`);
  
      return this.http.get<DataResponse>(`${this.balanceUri}/${id}`, { withCredentials: true }).pipe(
        tap((response) => {
          console.log('balances fetch response:', response);
        }),
        catchError((err) => {
          console.error('balances fetch error:', err);
          this.err.show(err);
          return throwError(() => err);
        }),
        finalize(() => {
          this.setProgress(false);
        })
      );
    }


   searchBalances(term: string): Observable<BalanceDto[]> {
    return this.http.get<BalanceDto[]>(`${this.balanceUri}/search`, {
      params: { term }
    });
  }

  deleteBalance(id: number): Observable<any> {
  return this.http.post<any>(`${this.balanceUri}/${id}/delete`, {}, { withCredentials: true }).pipe(
    tap((res) => {
      console.log('balance delete:', res);
    }),
    catchError((err) => {
      console.error('Delete error:', err);
      this.err.show(err);
      return throwError(() => err);
    })
  );
}
 

   
}



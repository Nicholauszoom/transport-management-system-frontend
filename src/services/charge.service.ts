import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { ChargeDto } from '../dtos/charge.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {
 private chargeUri: string = env.baseUrl + '/api/charge';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private chargeSubject = new BehaviorSubject<ChargeDto[]>([]);
  charges$ = this.chargeSubject.asObservable();


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

  setCharges(charges: ChargeDto[]) {
      this.chargeSubject.next(charges);
    }

  getCharges() {
    return this.chargeSubject.getValue();
  }

  fetchCharges(page: number = 1, size: number = 10): Observable<{ charges: ChargeDto[]; totalRecords: number }> {
    const url = `${this.chargeUri}/list?page=${page}&size=${size}`;
    console.log('Fetching charges from:', url);
    this.setProgress(true);
    return this.http.get<ChargeDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Charges fetch response:', response);
        const charges = response || [];
        const totalRecords = charges.length; // Fallback since no metadata from backend
        this.setCharges(charges);
        return { charges, totalRecords };
      }),
      tap(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'charges loaded successfully' });
      }),
      catchError((err) => {
        console.error('Charges fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

   searchCharges(term: string): Observable<ChargeDto[]> {
    return this.http.get<ChargeDto[]>(`${this.chargeUri}/search`, {
      params: { term }
    });
  }
 
}
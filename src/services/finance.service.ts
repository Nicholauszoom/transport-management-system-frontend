import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { FinancialDto } from '../dtos/financial.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
 private financeUri: string = env.baseUrl + '';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private financeSubject = new BehaviorSubject<FinancialDto[]>([]);
  payments$ = this.financeSubject.asObservable();

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

  setFinances(finances: FinancialDto[]) {
    this.financeSubject.next(finances);
  }

  getFinances() {
    return this.financeSubject.getValue();
  }

 fetchFinances(page: number = 1, size: number = 10, currentPage: number): Observable<{ finances: FinancialDto[]; totalRecords: number }> {
    const url = `${this.financeUri}/list?page=${page}&size=${size}`;
    console.log('Fetching finances from:', url);
    this.setProgress(true);

    return this.http.get<FinancialDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Finances fetch response:', response);
        const finances = response || [];
        const totalRecords = finances.length;
        this.setFinances(finances);
        return { finances, totalRecords };
      }),

      catchError((err) => {
        console.error('Taxes fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // Search finances
  searchFinances(
    term: string
  ): Observable<{ finances: FinancialDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('term', term.trim());

    return this.http.get<any>(`${this.financeUri}/search`, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {

        let finances: FinancialDto[] = [];

        if (Array.isArray(response)) {
          finances = response;
        } else if (response && Array.isArray(response.finances)) {
          finances = response.finances;
        } else if (response && Array.isArray(response.data)) {
          finances = response.data;
        }

        return { finances, totalRecords: finances.length };
      }),
      catchError((err) => {
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  uploadFile(file: File): Observable<DataResponse> {
  if (!file) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'No file selected' });
    return throwError(() => new Error('No file selected'));
  }

  const allowedExtensions = ['.csv', '.xlsx'];
  const fileNameLower = file.name.toLowerCase();
  const isValidExtension = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

  const maxSize = 5 * 1024 * 1024;

  if (!isValidExtension) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid file type. Only CSV or XLSX allowed' });
    return throwError(() => new Error('Invalid file type'));
  }
  if (file.size > maxSize) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'File size exceeds 5MB' });
    return throwError(() => new Error('File size too large'));
  }

  const formData = new FormData();
  formData.append('file', file);

  console.log('Uploading file:', file.name);

  this.setProgress(true);
  return this.http.post<DataResponse>(`${this.financeUri}/upload`, formData, { withCredentials: true,   responseType: 'text' as 'json' // This tells Angular to expect text but keeps typing
 }).pipe(
    tap((response) => {
      console.log('File upload response:', response);
      // REMOVED: Success toast from here - let component handle it
    }),
    catchError((err) => {
      console.error('File upload error:', err);
      this.err.show(err);
      return throwError(() => err);
    }),
    finalize(() => {
      this.setProgress(false);
    })
  );
}

}

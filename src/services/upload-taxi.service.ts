import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { TaxiDto } from '../dtos/Taxi.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorToast } from './error.service';
import { Router } from '@angular/router';
import { env } from '../constants/env.constant';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})
export class UploadTaxiService {
  private taxiUri: string = env.baseUrl + '/api/direct/debit/mandate';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private taxiSubject = new BehaviorSubject<TaxiDto[]>([]);
  payments$ = this.taxiSubject.asObservable();

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

  setTaxes(taxes: TaxiDto[]) {
    this.taxiSubject.next(taxes);
  }

  getTaxes() {
    return this.taxiSubject.getValue();
  }

 fetchTaxes(page: number = 1, size: number = 10, currentPage: number): Observable<{ taxes: TaxiDto[]; totalRecords: number }> {
    const url = `${this.taxiUri}/list?page=${page}&size=${size}`;
    console.log('Fetching taxes from:', url);
    this.setProgress(true);

    return this.http.get<TaxiDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Taxes fetch response:', response);
        const taxes = response || [];
        const totalRecords = taxes.length;
        this.setTaxes(taxes);
        return { taxes, totalRecords };
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

  // Search taxes
  searchTaxes(
    term: string
  ): Observable<{ taxes: TaxiDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('term', term.trim());

    return this.http.get<any>(`${this.taxiUri}/search`, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {

        let taxes: TaxiDto[] = [];

        if (Array.isArray(response)) {
          taxes = response;
        } else if (response && Array.isArray(response.taxes)) {
          taxes = response.taxes;
        } else if (response && Array.isArray(response.data)) {
          taxes = response.data;
        }

        return { taxes, totalRecords: taxes.length };
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
  return this.http.post<DataResponse>(`${this.taxiUri}/upload`, formData, { withCredentials: true,   responseType: 'text' as 'json' // This tells Angular to expect text but keeps typing
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

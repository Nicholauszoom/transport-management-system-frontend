import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';
import { MandateDto } from '../dtos/mandate.dto';
import { RequestType } from '../app/mandate/mandate-list/mandate-list.component';

@Injectable({
  providedIn: 'root'
})
export class MandateServiceService {
  private mandateUri: string = env.baseUrl + '/api/direct/debit/mandate';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private mandateSubject = new BehaviorSubject<MandateDto[]>([]);
  payments$ = this.mandateSubject.asObservable();

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

  setMandates(mandates: MandateDto[]) {
    this.mandateSubject.next(mandates);
  }

  getMandates() {
    return this.mandateSubject.getValue();
  }

  // Original fetchMandate method (kept for backward compatibility)
  fetchMandates(page: number = 1, size: number = 10): Observable<{ mandates: MandateDto[]; totalRecords: number }> {
    const url = `${this.mandateUri}/list?page=${page}&size=${size}`;
    console.log('Fetching mandates from:', url);
    this.setProgress(true);

    return this.http.get<MandateDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Mandates fetch response:', response);
        const mandates = response || [];
        const totalRecords = mandates.length;
        this.setMandates(mandates);
        return { mandates, totalRecords };
      }),

      catchError((err) => {
        console.error('Mandates fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // New method to fetch mandates by request type (for tabs)
  fetchMandatesByRequestType(
    requestType: RequestType,
    page: number = 1,
    size: number = 10
  ): Observable<{ mandates: MandateDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('page', page.toString())
      .set('size', size.toString());

    const url = `${this.mandateUri}/list`;
    console.log(`Fetching ${requestType} mandates from:`, url);
    console.log('Params:', params.toString());

    this.setProgress(true);

    return this.http.get<any>(url, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {
        console.log(`${requestType} mandates fetch response:`, response);

        // Handle different response formats
        let mandates: MandateDto[] = [];
        let totalRecords = 0;

        if (response && Array.isArray(response)) {
          // Simple array response
          mandates = response;
          totalRecords = response.length;
        } else if (response && response.mandates && Array.isArray(response.mandates)) {
          // Paginated response with loans property
          mandates = response.mandates;
          totalRecords = response.totalRecords || response.total || response.mandates.length;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data property
          mandates = response.data;
          totalRecords = response.totalRecords || response.total || response.data.length;
        } else {
          // Fallback
          mandates = [];
          totalRecords = 0;
        }

        this.setMandates(mandates);
        return { mandates, totalRecords };
      }),
      catchError((err) => {
        console.error(`${requestType} mandates fetch error:`, err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // Search mandates by request type
  searchMandatesByRequestType(
    requestType: RequestType,
    term: string
  ): Observable<{ mandates: MandateDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('term', term.trim());

    return this.http.get<any>(`${this.mandateUri}/search`, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {

        let mandates: MandateDto[] = [];

        if (Array.isArray(response)) {
          mandates = response;
        } else if (response && Array.isArray(response.mandates)) {
          mandates = response.mandates;
        } else if (response && Array.isArray(response.data)) {
          mandates = response.data;
        }

        return { mandates, totalRecords: mandates.length };
      }),
      catchError((err) => {
        console.error(`Search ${requestType} mandates error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  getMandate(id: string): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Fetching mandates from:', `${this.mandateUri}/${id}`);

    return this.http.get<DataResponse>(`${this.mandateUri}/${id}`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('mandates fetch response:', response);
      }),
      catchError((err) => {
        console.error('mandates fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
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
  return this.http.post<DataResponse>(`${this.mandateUri}/upload`, formData, { withCredentials: true,   responseType: 'text' as 'json' // This tells Angular to expect text but keeps typing
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

sendSelectedMandates(ids: number[]): Observable<any> {
  const url = `${this.mandateUri}/submit/mandate`; 
  return this.http.post(url, ids, { withCredentials: true }).pipe(
    tap(() => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Mandates sent successfully' });
    }),
    catchError((err: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      // Check different error formats
      if (err.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${err.error.message}`;
      } else if (typeof err.error === 'string') {
        // Backend returned plain text
        errorMessage = err.error;
      } else if (err.error?.message) {
        // Backend returned JSON with a message field
        errorMessage = err.error.message;
      }

      console.error('Error sending mandates:', errorMessage);

      this.toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: errorMessage
      });

      return throwError(() => new Error(errorMessage));
    })
  );
}



  // Helper method to format request type for display
  private formatRequestType(requestType: RequestType): string {
    const typeMap: { [key in RequestType]: string } = {
      'UPLOADED': 'Mandate Upload',
      'SUBMITTED': 'Mandate Submission',
      'FAILED': 'Failed Mandate'
    };
    return typeMap[requestType] || requestType;
  }
}
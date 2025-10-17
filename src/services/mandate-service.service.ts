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
 // Updated service method to handle Spring Data Page format
fetchMandatesByRequestType(
  requestType: RequestType,
  page: number = 0, // Spring uses 0-based indexing
  size: number = 10,
  currentPage: number = 0
): Observable<{ mandates: MandateDto[]; totalRecords: number; pageInfo: any }> {
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

      let mandates: MandateDto[] = [];
      let totalRecords = 0;
      let pageInfo = {};

      if (response && response.content && Array.isArray(response.content)) {
        // Spring Data Page response format
        mandates = response.content;
        totalRecords = response.totalElements || 0;
        pageInfo = {
          currentPage: response.number || 0, // Spring uses 0-based
          totalPages: response.totalPages || 0,
          pageSize: response.size || 10,
          numberOfElements: response.numberOfElements || 0,
          first: response.first || false,
          last: response.last || false,
          empty: response.empty || false
        };
      } else if (response && Array.isArray(response)) {
        // Simple array response (fallback)
        mandates = response;
        totalRecords = response.length;
        pageInfo = {
          currentPage: 0,
          totalPages: 1,
          pageSize: response.length,
          numberOfElements: response.length,
          first: true,
          last: true,
          empty: response.length === 0
        };
      } else if (response && response.mandates && Array.isArray(response.mandates)) {
        // Custom paginated response format (if you have other endpoints)
        mandates = response.mandates;
        totalRecords = response.totalRecords || response.total || response.mandates.length;
        pageInfo = {
          currentPage: page,
          totalPages: Math.ceil(totalRecords / size),
          pageSize: size,
          numberOfElements: mandates.length,
          first: page === 0,
          last: page >= Math.ceil(totalRecords / size) - 1,
          empty: mandates.length === 0
        };
      } else {
        // Fallback for unexpected format
        console.warn('Unexpected response format:', response);
        mandates = [];
        totalRecords = 0;
        pageInfo = {
          currentPage: 0,
          totalPages: 0,
          pageSize: size,
          numberOfElements: 0,
          first: true,
          last: true,
          empty: true
        };
      }

      this.setMandates(mandates);
      return { mandates, totalRecords, pageInfo };
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

sendSelectedMandates(ids: number[]): Observable<String> {
  const url = `${this.mandateUri}/submit/mandate`; 
  return this.http.post(url, ids, { withCredentials: true, responseType: 'text' }).pipe(
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

// createMandate
  createMandate(payload: any): Observable<{ mandates: MandateDto[]; totalRecords: number }> {
    this.setProgress(true);
    console.log('Submit mandate request to:', `${this.mandateUri}/create`);
    console.log('Request body:', payload);
    return this.http.post<any>(`${this.mandateUri}/create`, payload, { withCredentials: true }).pipe(
      map((response) => {
        // check for backend code
        if (response?.code && response.code !== 200) {
          throw { error: { message: response.message || 'Mandate failed' } };
        }

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
        console.error(`Mandate error:`, err);
        return throwError(() => err);
      })
    );
  }

  //delete selected mandates
  deleteSelectedMandates(ids: number[]): Observable<String> {
  const url = `${this.mandateUri}/delete/mandate`; 
  return this.http.post(url, ids, { withCredentials: true, responseType: 'text' }).pipe(
    tap(() => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Mandates deleted successfully' });
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

      console.error('Error Deleting mandates:', errorMessage);

      this.toast.add({
        severity: 'error',
        summary: 'Failed',
        detail: errorMessage
      });

      return throwError(() => new Error(errorMessage));
    })
  );
}

  // delete mandate
  deleteMandete(id: number): Observable<String> {
  return this.http.post(`${this.mandateUri}/${id}/delete`, {}, { withCredentials: true, responseType: 'text' }).pipe(
    tap((res) => {
      console.log('Backend response:', res); // "Mandate deleted SUCCESS"
      this.toast.add({ severity: 'success', summary: 'Success', detail: res });
      this.router.navigate(['mandate']);
    }),
    catchError((err) => {
      console.error('Mandate update error:', err);
      this.err.show(err);
      return throwError(() => err);
    }),
    finalize(() => {
      this.setProgress(false);
    })
  );
}

updateMandate(id: number, payload: any): Observable<string> {
  this.setProgress(true);
  return this.http.post(`${this.mandateUri}/${id}/update`, payload, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
    tap((res) => {
      console.log('Backend response:', res); // "Mandate UPDATED SUCCESS"
      this.toast.add({ severity: 'success', summary: 'Success', detail: res });
      this.router.navigate(['mandate']);
    }),
    catchError((err) => {
      console.error('Mandate update error:', err);
      this.err.show(err);
      return throwError(() => err);
    }),
    finalize(() => {
      this.setProgress(false);
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

getMandateById(id: number): Observable<any> {
  return this.http.get<any>(`${this.mandateUri}/${id}`, { withCredentials: true }).pipe(
    catchError((err) => {
      console.error('Get mandate by ID error:', err);
      return throwError(() => err);
    })
  );
}

  // Helper method to format request type for display
  private formatRequestType(requestType: RequestType): string {
    const typeMap: { [key in RequestType]: string } = {
      'UPLOADED': 'Mandate Upload',
      'PRESUBMITTED': 'Mandate Submission',
      'SUBMITTED': 'Succeed Mandate',
      'FAILED': 'Failed Mandate'
    };
    return typeMap[requestType] || requestType;
  }
}
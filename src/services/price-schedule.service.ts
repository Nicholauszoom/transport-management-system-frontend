import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root',
})
export class PriceScheduleService {
  private baseUrl: string = env.baseUrl + '/api/charge/price-schedule';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private err: ErrorToast
  ) {}

  getProgress() {
    return this.progressSubject.getValue();
  }

  setProgress(progress: boolean) {
    this.progressSubject.next(progress);
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
  return this.http.post<DataResponse>(`${this.baseUrl}/upload`, formData, { withCredentials: true,   responseType: 'text' as 'json' // This tells Angular to expect text but keeps typing
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
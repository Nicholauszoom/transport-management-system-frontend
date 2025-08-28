import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { TakeoverPaymentDto } from '../dtos/takeover-payment.dto';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';
import { PaymentStatus } from '../app/takeover/payment/takeover-payment-view/takeover-payment-view.component';

export type RequestType = 
  | 'takeover_payment' 
  | 'takeover_settlement';

@Injectable({
  providedIn: 'root'
})
export class TakeoverPaymentService {
  private paymentUri: string = env.baseUrl + '/api/takeover/payment';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private paymentSubject = new BehaviorSubject<TakeoverPaymentDto[]>([]);
  payments$ = this.paymentSubject.asObservable();

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

  setPayments(payments: TakeoverPaymentDto[]) {
    this.paymentSubject.next(payments);
  }

  getPayments() {
    return this.paymentSubject.getValue();
  }

  // Original fetchLoans method (kept for backward compatibility)
  fetchPayments(page: number = 1, size: number = 10): Observable<{ payments: TakeoverPaymentDto[]; totalRecords: number }> {
    const url = `${this.paymentUri}/list?page=${page}&size=${size}`;
    console.log('Fetching payments from:', url);
    this.setProgress(true);

    return this.http.get<TakeoverPaymentDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Payments fetch response:', response);
        const payments = response || [];
        const totalRecords = payments.length;
        this.setPayments(payments);
        return { payments, totalRecords };
      }),

      catchError((err) => {
        console.error('Payments fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // New method to fetch loans by request type (for tabs)
  fetchPaymentsByRequestType(
    requestType: RequestType,
    page: number = 1,
    size: number = 10
  ): Observable<{ payments: TakeoverPaymentDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('page', page.toString())
      .set('size', size.toString());

    const url = `${this.paymentUri}/list`;
    console.log(`Fetching ${requestType} payments from:`, url);
    console.log('Params:', params.toString());

    this.setProgress(true);

    return this.http.get<any>(url, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {
        console.log(`${requestType} payments fetch response:`, response);

        // Handle different response formats
        let payments: TakeoverPaymentDto[] = [];
        let totalRecords = 0;

        if (response && Array.isArray(response)) {
          // Simple array response
          payments = response;
          totalRecords = response.length;
        } else if (response && response.payments && Array.isArray(response.payments)) {
          // Paginated response with loans property
          payments = response.payments;
          totalRecords = response.totalRecords || response.total || response.payments.length;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data property
          payments = response.data;
          totalRecords = response.totalRecords || response.total || response.data.length;
        } else {
          // Fallback
          payments = [];
          totalRecords = 0;
        }

        this.setPayments(payments);
        return { payments, totalRecords };
      }),
      catchError((err) => {
        console.error(`${requestType} payments fetch error:`, err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // Search loans by request type
  searchPaymentsByRequestType(
    requestType: RequestType,
    term: string
  ): Observable<{ payments: TakeoverPaymentDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('term', term.trim());

    return this.http.get<any>(`${this.paymentUri}/search`, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {

        let payments: TakeoverPaymentDto[] = [];

        if (Array.isArray(response)) {
          payments = response;
        } else if (response && Array.isArray(response.payments)) {
          payments = response.payments;
        } else if (response && Array.isArray(response.data)) {
          payments = response.data;
        }

        return { payments, totalRecords: payments.length };
      }),
      catchError((err) => {
        console.error(`Search ${requestType} payments error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  getPayment(id: string): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Fetching payments from:', `${this.paymentUri}/${id}`);

    return this.http.get<DataResponse>(`${this.paymentUri}/${id}`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('payments fetch response:', response);
      }),
      catchError((err) => {
        console.error('payments fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

// paymentAcknoledgementAction 
paymentAcknoledgementAction(
  id: string,
  requestAction: PaymentStatus,
  remarks: string
): Observable<{ payments: TakeoverPaymentDto[]; totalRecords: number }> {
  
  // ✅ Send both values in the body
  const body = { 
    remarks: remarks,
    paymentStatus: requestAction 
  };

  return this.http.post<any>(`${this.paymentUri}/${id}/acknoledge`, body, {
      withCredentials: true
    }).pipe(
      map((response) => {
        // ✅ check backend response consistency
        if (response?.code && response.code !== 200) {
          throw { error: { message: response.message || 'Acknowledgement failed' } };
        }

        let payments: TakeoverPaymentDto[] = [];

        if (Array.isArray(response)) {
          payments = response;
        } else if (response && Array.isArray(response.loans)) {
          payments = response.loans;
        } else if (response && Array.isArray(response.data)) {
          payments = response.data;
        }

        return { payments, totalRecords: payments.length };
      }),
      catchError((err) => {
        console.error(`Approve ${requestAction} payments error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
}
 
  // Helper method to format request type for display
  private formatRequestType(requestType: RequestType): string {
    const typeMap: { [key in RequestType]: string } = {
      'takeover_payment': 'Takeover Payment',
      'takeover_settlement': 'Takeover Settlement'
    };
    return typeMap[requestType] || requestType;
  }
}
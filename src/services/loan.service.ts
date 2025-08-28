import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { LoanDto } from '../dtos/loan.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';
import { BalanceDto } from '../dtos/balance.dto';

export type LoanRequestType =
  | 'fsp_received'
  | 'fsp_accepted'
  | 'fsp_rejected'
  | 'employee_rejected'
  | 'hro_approved'
  | 'hro_rejected'
  | 'disbursement_approved'
  | 'disbursement_rejected';

export type LoanAction = 'APPROVED' | 'REJECTED';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private loanUri: string = env.baseUrl + '/api/loan';
  private balanceUri: string = env.baseUrl + '/api/balance';
  private disbursementUri: string = env.baseUrl + '/api/disbursement';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private loanSubject = new BehaviorSubject<LoanDto[]>([]);
  loans$ = this.loanSubject.asObservable();

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

  setLoans(loans: LoanDto[]) {
    this.loanSubject.next(loans);
  }

  getLoans() {
    return this.loanSubject.getValue();
  }

   setBalances(loans: LoanDto[]) {
    this.loanSubject.next(loans);
  }

  getBalances() {
    return this.loanSubject.getValue();
  }

  // Original fetchLoans method (kept for backward compatibility)
  fetchLoans(page: number = 1, size: number = 10): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    const url = `${this.loanUri}/list?page=${page}&size=${size}`;
    console.log('Fetching loans from:', url);
    this.setProgress(true);

    return this.http.get<LoanDto[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Loans fetch response:', response);
        const loans = response || [];
        const totalRecords = loans.length;
        this.setLoans(loans);
        return { loans, totalRecords };
      }),

      catchError((err) => {
        console.error('Loans fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // New method to fetch loans by request type (for tabs)
  fetchLoansByRequestType(
    requestType: LoanRequestType,
    page: number = 1,
    size: number = 10
  ): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('page', page.toString())
      .set('size', size.toString());

    const url = `${this.loanUri}/list`;
    console.log(`Fetching ${requestType} loans from:`, url);
    console.log('Params:', params.toString());

    this.setProgress(true);

    return this.http.get<any>(url, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {
        console.log(`${requestType} loans fetch response:`, response);

        // Handle different response formats
        let loans: LoanDto[] = [];
        let totalRecords = 0;

        if (response && Array.isArray(response)) {
          // Simple array response
          loans = response;
          totalRecords = response.length;
        } else if (response && response.loans && Array.isArray(response.loans)) {
          // Paginated response with loans property
          loans = response.loans;
          totalRecords = response.totalRecords || response.total || response.loans.length;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data property
          loans = response.data;
          totalRecords = response.totalRecords || response.total || response.data.length;
        } else {
          // Fallback
          loans = [];
          totalRecords = 0;
        }

        this.setLoans(loans);
        return { loans, totalRecords };
      }),
      catchError((err) => {
        console.error(`${requestType} loans fetch error:`, err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }


  fetchLiquidatedLoans(
    requestType: string,
    page: number = 1,
    size: number = 10
  ): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('page', page.toString())
      .set('size', size.toString());

    const url = `${this.loanUri}/list`;
    console.log(`Fetching ${requestType} loans from:`, url);
    console.log('Params:', params.toString());

    this.setProgress(true);

    return this.http.get<any>(url, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {
        console.log(`${requestType} loans fetch response:`, response);

        // Handle different response formats
        let loans: LoanDto[] = [];
        let totalRecords = 0;

        if (response && Array.isArray(response)) {
          // Simple array response
          loans = response;
          totalRecords = response.length;
        } else if (response && response.loans && Array.isArray(response.loans)) {
          // Paginated response with loans property
          loans = response.loans;
          totalRecords = response.totalRecords || response.total || response.loans.length;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data property
          loans = response.data;
          totalRecords = response.totalRecords || response.total || response.data.length;
        } else {
          // Fallback
          loans = [];
          totalRecords = 0;
        }

        this.setLoans(loans);
        return { loans, totalRecords };
      }),
      catchError((err) => {
        console.error(`${requestType} loans fetch error:`, err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  // Search loans by request type
  searchLoansByRequestType(
    requestType: LoanRequestType,
    term: string
  ): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestType', requestType)
      .set('term', term.trim());

    return this.http.get<any>(`${this.loanUri}/search`, {
      params,
      withCredentials: true
    }).pipe(
      map((response) => {

        let loans: LoanDto[] = [];

        if (Array.isArray(response)) {
          loans = response;
        } else if (response && Array.isArray(response.loans)) {
          loans = response.loans;
        } else if (response && Array.isArray(response.data)) {
          loans = response.data;
        }

        return { loans, totalRecords: loans.length };
      }),
      catchError((err) => {
        console.error(`Search ${requestType} loans error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  // Original search method (kept for backward compatibility)
  searchLoans(term: string): Observable<LoanDto[]> {
    return this.http.get<LoanDto[]>(`${this.loanUri}/search`, {
      params: { term }
    });
  }

  getLoan(id: string): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Fetching loan from:', `${this.loanUri}/${id}`);

    return this.http.get<DataResponse>(`${this.loanUri}/${id}`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Loan fetch response:', response);
      }),
      catchError((err) => {
        console.error('Loan fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  deleteLoan(id: number): Observable<any> {
    return this.http.post<any>(`${this.loanUri}/${id}/delete`, {}, { withCredentials: true }).pipe(
      map((res) => {
        console.log('Loan delete:', res);
      }),
      catchError((err) => {
        console.error('Delete error:', err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  // Approve loans by request type
  loanApproveAction(id: string, requestAction: LoanAction): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    let params = new HttpParams()
      .set('requestAction', requestAction);

    return this.http.post(`${this.loanUri}/${id}/approve`, {}, {
      params,
      withCredentials: true,
       responseType: 'text' as 'json'
    }).pipe(
      map((response: any) => {
  if (response?.code && response.code !== 200) {
    throw { error: { message: response.message || 'Approve failed' } };
  }

  let loans: LoanDto[] = [];

  if (Array.isArray(response)) {
    loans = response;
  } else if (response && Array.isArray(response.loans)) {
    loans = response.loans;
  } else if (response && Array.isArray(response.data)) {
    loans = response.data;
  }

  // ✅ include backend message so component can use it
  return { loans, totalRecords: loans.length, message: response.message };
}),

      catchError((err) => {
        console.error(`Approve ${requestAction} loans error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  // Disburse loans by request type with reason
  loanDisbursementAction(
    id: string,
    requestAction: LoanAction,
    reason: string
  ): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    let params = new HttpParams().set('requestAction', requestAction);

    // send reason in body
    const body = { reason };

    return this.http.post<any>(`${this.disbursementUri}/${id}/disburse`, body, {
      params,
      withCredentials: true,
       responseType: 'text' as 'json'
    }).pipe(
      map((response) => {

        // ✅ check for backend code
        if (response?.code && response.code !== 200) {
          throw { error: { message: response.message || 'Didbursement failed' } };
        }

        let loans: LoanDto[] = [];

        if (Array.isArray(response)) {
          loans = response;
        } else if (response && Array.isArray(response.loans)) {
          loans = response.loans;
        } else if (response && Array.isArray(response.data)) {
          loans = response.data;
        }

        return { loans, totalRecords: loans.length };
      }),
      catchError((err) => {
        console.error(`Approve ${requestAction} loans error:`, err);
        this.err.show(err);
        return throwError(() => err);
      })
    );
  }

  // Liquidation loans by request type with reason
  loanLiquidationAction(
    id: string,
    remark: string
  ): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    const body = { remark };

    return this.http.post<any>(`${this.loanUri}/${id}/liquidate`, body, {
      withCredentials: true
    }).pipe(
      map((response) => {
        // ✅ check for backend code
        if (response?.code && response.code !== 200) {
          throw { error: { message: response.message || 'Liquidation failed' } };
        }

        let loans: LoanDto[] = [];

        if (Array.isArray(response)) {
          loans = response;
        } else if (response && Array.isArray(response.loans)) {
          loans = response.loans;
        } else if (response && Array.isArray(response.data)) {
          loans = response.data;
        }

        return { loans, totalRecords: loans.length };
      }),
      catchError((err) => {
        console.error(`Liquidate loans error:`, err);
        return throwError(() => err);
      })
    );
  }


  // createLiquidation
  liquidation(payload: any): Observable<{ loans: LoanDto[]; totalRecords: number }> {
    this.setProgress(true);
    console.log('Submit liquidation request to:', `${this.loanUri}/liquidation`);
    console.log('Request body:', payload);
    return this.http.post<any>(`${this.loanUri}/liquidation`, payload, { withCredentials: true }).pipe(
      map((response) => {
        // ✅ check for backend code
        if (response?.code && response.code !== 200) {
          throw { error: { message: response.message || 'Liquidation failed' } };
        }

        let loans: LoanDto[] = [];

        if (Array.isArray(response)) {
          loans = response;
        } else if (response && Array.isArray(response.loans)) {
          loans = response.loans;
        } else if (response && Array.isArray(response.data)) {
          loans = response.data;
        }

        return { loans, totalRecords: loans.length };
      }),
      catchError((err) => {
        console.error(`Liquidate loans error:`, err);
        return throwError(() => err);
      })
    );
  }

  // Helper method to format request type for display
  private formatRequestType(requestType: LoanRequestType): string {
    const typeMap: { [key in LoanRequestType]: string } = {
      'fsp_received': 'FSP Received',
      'fsp_accepted': 'FSP Accepted',
      'fsp_rejected': 'FSP Rejected',
      'employee_rejected': 'Employee Rejected',
      'hro_approved': 'HRO Approved',
      'hro_rejected': 'HRO Rejected',
      'disbursement_approved': 'Disbursement Approved',
      'disbursement_rejected': 'Disbursement Rejected'
    };
    return typeMap[requestType] || requestType;
  }
}
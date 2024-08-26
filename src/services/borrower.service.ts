import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BorrowerDto } from '../dtos/borrower.dto';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';
import { BorrowerFilter } from '../dtos/BorrowerFilter.dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {
  private url = `${env.baseUrl}/api/portal/borrower/list`;
  private urlFilter = `${env.baseUrl}/api/portal/borrower/search`;

  private borrowersSubject = new BehaviorSubject<BorrowerDto[]>([]);
  borrowers$ = this.borrowersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) {}

  getBorrowers(): BorrowerDto[] {
    return this.borrowersSubject.getValue();
  }

  setBorrowers(borrowers: BorrowerDto[]) {
    this.borrowersSubject.next(borrowers);
  }

  // Fetch borrowers without filters
  public fetchBorrowers(page: number = 1, size: number = 10) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    this.http.get<DataResponse>(this.url, { params, withCredentials: true })
      .subscribe({
        next: res => {
          const borrowers = res.data as BorrowerDto[]; // Explicitly cast data to BorrowerDto[]
          this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.setBorrowers(borrowers);
        },
        error: err => {
          this.err.show(err);
        }
      });
  }

  // Filter borrowers based on criteria
  public filterBorrowers(filter: BorrowerFilter, page: number = 1, size: number = 10) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      if (filter.firstName) {
        params = params.set('firstName', filter.firstName);
      }
      if (filter.middleName) {
        params = params.set('middleName', filter.middleName);
      }
      if (filter.lastName) {
        params = params.set('lastName', filter.lastName);
      }
      if (filter.NIN) {
        params = params.set('NIN', filter.NIN);
      }
      if (filter.bankAccountNumber) {
        params = params.set('bankAccountNumber', filter.bankAccountNumber);
      }
    }

    this.http.get<DataResponse>(this.urlFilter, { params, withCredentials: true })
      .subscribe({
        next: res => {
          const borrowers = res.data as BorrowerDto[]; // Explicitly cast data to BorrowerDto[]
          this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.setBorrowers(borrowers);
        },
        error: err => {
          this.err.show(err);
        }
      });
  }
}

import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BorrowerDto } from '../dtos/borrower.dto';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  private url = `${env.baseUrl}/api/portal/borrower/list`;

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

  public fetchBorrowers(page: number = 1, size: number = 10) {
    this.http.get<DataResponse>(`${this.url}?page=${page}&size=${size}`, {withCredentials: true})
      .subscribe({
        next: res => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.setBorrowers(res.data); // Ensure this is the correct format for data
        },
        error: err => {
          this.err.show(err);
        }
      });
  }
}

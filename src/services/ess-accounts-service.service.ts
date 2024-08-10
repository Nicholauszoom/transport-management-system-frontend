import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from '../constants/env.constant';
import { AccountDto } from '../dtos/account.dto';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})

export class EssAccountsService {
  private url: string = env.baseUrl+"/api/portal/account";

  private accountsSubject = new BehaviorSubject<AccountDto[]>([]);  
  accounts$ = this.accountsSubject.asObservable();

  getAccounts() {
    return this.accountsSubject.getValue();
}
  setAccounnts(accounts: AccountDto[]) {  
    this.accountsSubject.next(accounts);
  }

  constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {
  }

  ngOnInit(): void {
    this.fetchAccounts();
}

uploadFile(formData: FormData): Observable<any> {
  return this.http.post(this.url+"/upload", formData, {
      reportProgress: true, 
      observe: 'events' 
  });
}


 

  public fetchAccounts() {
    this.http.get<DataResponse>(this.url+"/list", {withCredentials: true})
    .subscribe(
        {
            next: res => {
                this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
                this.setAccounnts(res.data);
            },
            error: err => {
                this.err.show(err);
            }
        }
    );
}
}


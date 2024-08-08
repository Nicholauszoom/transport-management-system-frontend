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

  url=  env.baseUrl;

  private borrowersSubject = new BehaviorSubject<BorrowerDto[]>([]);  
  borrowers$ = this.borrowersSubject.asObservable();

  getBorrowers() {
    return this.borrowersSubject.getValue();

}

setBorrowers(borrowers: BorrowerDto[]) {  
  this.borrowersSubject.next(borrowers);
}

constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {

}

ngOnInit(): void {
    this.fetchBorrowers();
}

public fetchBorrowers() {
    this.http.get<DataResponse>(this.url+"/api/portal/borrower/list", {withCredentials: true})
    .subscribe(
        {
            next: res => {
                this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
                this.setBorrowers(res.data);
            },
            error: err => {
                this.err.show(err);
            }
        }
    );
}
 
}



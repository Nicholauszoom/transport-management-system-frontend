import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { DataResponse } from '../dtos/api.dto';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authUri: string = env.baseUrl+"/user";
    private progressSubject = new BehaviorSubject<boolean>(false);  
    inProgress$ = this.progressSubject.asObservable();

    getValue() {
        return this.progressSubject.getValue();
    }

    setValue(progress: boolean) {  
        this.progressSubject.next(progress);
    }

    constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {

    }

    public async login(credentials: any) {
        this.setValue(true);
        this.http.post<DataResponse>(this.authUri+"/login", credentials, { withCredentials: true })
        .pipe(
            finalize(() => {
                this.setValue(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: res.message })
                    this.router.navigate(['fsp-categories']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }
}
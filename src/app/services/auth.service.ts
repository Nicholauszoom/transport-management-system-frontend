import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { DataResponse } from '../dtos/api.dto';

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

    constructor(private http: HttpClient, private toast: MessageService) {

    }

    public async login(credentials: any) {
        
        this.setValue(true);
        this.http.post<DataResponse>(this.authUri+"/login", credentials)
        .pipe(
            finalize(() => {
                this.setValue(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: res.message })
                },
                error: err => {
                    console.error(err)
                    //Set default message to http client response message
                    let message = err.message;

                    //If error comes from the backend server then use appropriate message from it
                    if(err.status != 0){
                        message = err.error.message;
                    }

                    this.toast.add({ severity: 'error', summary: 'Error occured', detail: message })
                }
            }
        );
    }
}
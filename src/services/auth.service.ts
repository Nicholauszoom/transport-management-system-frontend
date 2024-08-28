import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { DataResponse } from '../dtos/api.dto';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUri: string = env.baseUrl + "/user";
  private logoutUrl:string = env.baseUrl+ "/logout"
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) {}

  private setValue(progress: boolean) {
    this.progressSubject.next(progress);
  }

  public login(credentials: any) {
    this.setValue(true);
    this.http.post<DataResponse>(`${this.authUri}/login`, credentials, { withCredentials: true })
      .pipe(
        catchError(err => {
          this.err.show(err);
          this.setValue(false);
          throw err;  // rethrow the error to prevent further processing
        }),
        finalize(() => {
          this.setValue(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.handleLoginSuccess(res);
        },
        error: (err) => {
          // This error block may not be necessary if catchError is used correctly.
          // Keeping it here to ensure any unexpected errors are caught.
          this.err.show(err);
        },
      });
  }

  private handleLoginSuccess(response: DataResponse) {
    // Assuming response contains tokens
    const { accessToken, refreshToken } = response.data;
    // Store tokens (could be in localStorage or sessionStorage)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
    this.router.navigate(['fsp-categories']);
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}).pipe(
      tap(() => {
        this.clearLocalStorage();
      }),
      catchError((error) => {
        console.error('Logout failed', error);
        this.clearLocalStorage();
        return of(null); // Return an observable with null value
      })
    );
  }
  
  private clearLocalStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  

}
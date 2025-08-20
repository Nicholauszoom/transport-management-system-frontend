import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs'; // Added throwError for catchError
import { catchError, finalize, tap } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { DataResponse } from '../dtos/api.dto';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUri: string = env.baseUrl + "/api/auth";
  private logoutUrl: string = env.baseUrl + "/logout";
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

  public login(credentials: any): Observable<DataResponse> {
  this.setValue(true);

  return this.http.post<DataResponse>(`${this.authUri}/login`, credentials) // removed withCredentials
    .pipe(
      tap((res) => this.handleLoginSuccess(res)),
      catchError((err) => {
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setValue(false);
      })
    );
}

public verify(credentials: any): Observable<string> {
  this.setValue(true);

  return this.http.post(`${this.authUri}/verify`, credentials, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'  // <-- crucial
  }).pipe(
    tap((res) => console.log('Backend response:', res)),
    catchError((err) => {
      this.err.show(err);
      return throwError(() => err);
    }),
    finalize(() => this.setValue(false))
  );
}




private handleLoginSuccess(response: any) {
  const { token, expiresIn } = response;

  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiry', (Date.now() + expiresIn).toString());

  this.toast.add({
    severity: 'success',
    summary: 'Login Successful',
    detail: 'Welcome back!'
  });

  this.router.navigate(['/dashboard']);
}

public getToken(): string | null {
  return localStorage.getItem('token');
}

public isTokenExpired(): boolean {
  const expiry = localStorage.getItem('tokenExpiry');
  return !expiry || Date.now() > +expiry;
}

public logout(): void {
  this.clearLocalStorage();
  this.router.navigate(['/login']);
}

private clearLocalStorage(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
}
}
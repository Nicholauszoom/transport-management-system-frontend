import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { UserDto } from '../dtos/user.dto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private user: any;

  private url = `${env.baseUrl}/api/admin/user/list`;

  private authUrl = `${env.baseUrl}/api/auth`;

   private userUrl = `${env.baseUrl}/api/user`;

  private usersSubject = new BehaviorSubject<UserDto[]>([]);
  users$ = this.usersSubject.asObservable();
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast) {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  getProgress() {
    return this.progressSubject.getValue();
  }

  setProgress(progress: boolean) {
    this.progressSubject.next(progress);
  }

  getLoggedInUser() {
    return this.user;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    this.user = null;
  }

  getUsers(): UserDto[] {
    return this.usersSubject.getValue();
  }

  setUsers(users: UserDto[]) {
    this.usersSubject.next(users);
  }

  public fetchUsers(page: number = 1, size: number = 10) {
    this.http.get<UserDto[]>(`${this.url}?page=${page}&size=${size}`, { withCredentials: true })
      .subscribe({
        next: (users) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Users loaded successfully' });
          this.setUsers(users);
        },
        error: err => {
          this.err.show(err);
        }
      });
  }

  createUser(payload: any): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Sending user creation request to:', `${this.authUrl}/signup`);
    console.log('Request body:', payload);

    return this.http.post<DataResponse>(`${this.authUrl}/signup`, payload, { withCredentials: true }).pipe(
      tap((res) => {
        const data = res.data;
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'User Created Sucessfull' });
        this.router.navigate(['user']);
      }),
      catchError((err) => {
        console.error('User creation error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

    deleteUser(id: number): Observable<any> {
  return this.http.post<any>(`${this.userUrl}/${id}/delete`, {}, { withCredentials: true }).pipe(
    tap((res) => {
      console.log('user delete:', res);
    }),
    catchError((err) => {
      console.error('Delete error:', err);
      this.err.show(err);
      return throwError(() => err);
    })
  );
}

}

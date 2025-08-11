import { Injectable } from '@angular/core';
import { env } from '../constants/env.constant';
import { BehaviorSubject } from 'rxjs';
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

    private url = `${env.baseUrl}/admin/user/list`;
  
    private usersSubject = new BehaviorSubject<UserDto[]>([]);
    users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient,
      private toast: MessageService,
      private router: Router,
      private err: ErrorToast) {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
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

}

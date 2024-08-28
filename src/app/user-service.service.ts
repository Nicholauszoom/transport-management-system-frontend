import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private user: any;

  constructor() {
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
}

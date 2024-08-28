import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileDto } from '../dtos/profile.dto';
import { env } from '../constants/env.constant';
import { catchError, map } from 'rxjs/operators';
import { ErrorToast } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  private profileUri: string = env.baseUrl+"/user/profile";


  private profileSubject = new BehaviorSubject<ProfileDto | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient, private err: ErrorToast) {}

  fetchProfile(): Observable<ProfileDto> {
    return this.http.get<{ data: ProfileDto }>(this.profileUri, { withCredentials: true })
      .pipe(
        map(response => {
          this.profileSubject.next(response.data);
          return response.data;
        }),
        catchError(error => {
          this.err.show(error);
          throw error;
        })
      );
  }
}

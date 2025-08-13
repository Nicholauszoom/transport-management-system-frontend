import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getDashboardStats(): Observable<{ users: number; products: number; loans: number }> {
    // Mock API response
    return of({ users: 25, products: 3, loans: 500 });
  }
}

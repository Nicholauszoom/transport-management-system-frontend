import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MenuComponent } from '../../../partials/main-layout/main-layout.component';
import { TakeoverBalanceDto } from '../../../../dtos/takeover-balance.dto';
import { TakeoverBalanceService } from '../../../../services/takeover-balance.service';

@Component({
  selector: 'app-takeover-balance-list',
  standalone: true,
  imports: [MenuComponent,
          TableModule,
          DropdownModule,
          InputTextModule,
          ReactiveFormsModule,
          CommonModule,
          ButtonModule,
          FormsModule,
          CardModule],
  templateUrl: './takeover-balance-list.component.html',
  styleUrl: './takeover-balance-list.component.css'
})
export class TakeoverBalanceListComponent implements OnInit, OnDestroy {
  balances: TakeoverBalanceDto[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private balanceService: TakeoverBalanceService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.balanceService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
      this.loading = progress;
    });
    this.fetchBalances();
  }

  fetchBalances(page: number = this.currentPage, size: number = this.pageSize) {
    this.balanceService
      .fetchBalances(page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Fetched balances:', response);
          this.balances = response.balances;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error('Failed to fetch balances:', err);
        },
      });
  }

   searchBalances() {
    this.balanceService.searchBalances(this.term).subscribe({
      next: (data) => {
        this.balances = data;
      },
      error: (err) => {
        console.error('Error fetching balances:', err);
      }
    });
  }

   viewBalance(id: string) {
    this.router.navigate(['takeover-balance-view', id]);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; 
    this.pageSize = event.rows;
    this.fetchBalances(this.currentPage, this.pageSize);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { TakeoverPaymentDto } from '../../../../dtos/takeover-payment.dto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Subject, takeUntil } from 'rxjs';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuComponent } from '../../../partials/main-layout/main-layout.component';
import { TakeoverPaymentService } from '../../../../services/takeover-payment.service';

export type RequestType = 
  | 'takeover_payment' 
  | 'takeover_settlement';

@Component({
  selector: 'app-takeover-payment',
  standalone: true,
  imports: [MenuComponent,
          TableModule,
          DropdownModule,
          InputTextModule,
          ReactiveFormsModule,
          CommonModule,
          ButtonModule,
          FormsModule,
          CardModule,
          TabMenuModule],
  templateUrl: './takeover-payment.component.html',
  styleUrl: './takeover-payment.component.css'
})
export class TakeoverPaymentComponent implements OnInit, OnDestroy {
  payments: TakeoverPaymentDto[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  
  // Tab management
  tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;
  currentRequestType: RequestType = 'takeover_payment';
  
  private destroy$ = new Subject<void>();

  constructor(
    private paymentService: TakeoverPaymentService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {
    this.initializeTabs();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    this.paymentService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => {
        this.loading = progress;
      });

    // Set default active tab and fetch initial data
    this.activeTab = this.tabItems[0];
    this.fetchPayments();
  }

  private initializeTabs(): void {
    this.tabItems = [
      {
        label: 'Payment Received',
        icon: 'pi pi-inbox',
        id: 'takeover_payment'
      },
      {
        label: 'Settlement',
        icon: 'pi pi-check-circle',
        id: 'takeover_settlement'
      }
    ];
  }

  onTabChange(activeItem: MenuItem): void {
    this.activeTab = activeItem;
    this.currentRequestType = activeItem.id as RequestType;
    this.currentPage = 1; 
    this.term = '';
    this.fetchPayments();
  }

  fetchPayments(page: number = this.currentPage, size: number = this.pageSize): void {
    this.paymentService
      .fetchPaymentsByRequestType(this.currentRequestType, page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(`Fetched ${this.currentRequestType} payments:`, response);
          this.payments = response.payments;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error(`Failed to fetch ${this.currentRequestType} payments:`, err);
        },
      });
  }

  searchPayments(): void {
    if (this.term.trim()) {
      this.paymentService
        .searchPaymentsByRequestType(this.currentRequestType, this.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.payments = data.payments || data;
            this.totalRecords = this.payments.length;
          },
          error: (err) => {
            console.error('Error searching payments:', err);
          }
        });
    } else {
      this.fetchPayments();
    }
  }

  viewPayments(id: string): void {
    this.router.navigate(['view-takeover-payment', id]);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchPayments(this.currentPage, this.pageSize);
  }

  // Helper methods for status display
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'takeover_payment': 'Takeover Payment',
      'takeover_settlement': 'Takeover Settlement'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
    const severityMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'takeover_payment': 'info',
      'takeover_settlement': 'success'
    };
    return severityMap[status] || 'info';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
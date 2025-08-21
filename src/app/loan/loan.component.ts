import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LoanDto } from '../../dtos/loan.dto';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Subject, takeUntil } from 'rxjs';
import { TabMenuModule } from 'primeng/tabmenu';

export type LoanRequestType = 
  | 'fsp_received' 
  | 'fsp_accepted' 
  | 'fsp_rejected' 
  | 'employee_rejected' 
  | 'hro_approved' 
  | 'hro_rejected' 
  | 'disbursement_approved' 
  | 'disbursement_rejected';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [
        MenuComponent,
        TableModule,
        DropdownModule,
        InputTextModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        FormsModule,
        CardModule,
        TabMenuModule

      ],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent implements OnInit, OnDestroy {
  loans: LoanDto[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  
  // Tab management
  tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;
  currentRequestType: LoanRequestType = 'fsp_received';
  
  private destroy$ = new Subject<void>();

  constructor(
    private loanService: LoanService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {
    this.initializeTabs();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    this.loanService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => {
        this.loading = progress;
      });

    // Set default active tab and fetch initial data
    this.activeTab = this.tabItems[0];
    this.fetchLoans();
  }

  private initializeTabs(): void {
    this.tabItems = [
      {
        label: 'FSP Received',
        icon: 'pi pi-inbox',
        id: 'fsp_received'
      },
      {
        label: 'FSP Accepted',
        icon: 'pi pi-check-circle',
        id: 'fsp_accepted'
      },
      {
        label: 'FSP Rejected',
        icon: 'pi pi-times-circle',
        id: 'fsp_rejected'
      },
      {
        label: 'Employee Rejected',
        icon: 'pi pi-user-minus',
        id: 'employee_rejected'
      },
      {
        label: 'HRO Approved',
        icon: 'pi pi-verified',
        id: 'hro_approved'
      },
      {
        label: 'HRO Rejected',
        icon: 'pi pi-ban',
        id: 'hro_rejected'
      },
      {
        label: 'Disbursement Approved',
        icon: 'pi pi-money-bill',
        id: 'disbursement_approved'
      },
      {
        label: 'Disbursement Rejected',
        icon: 'pi pi-exclamation-triangle',
        id: 'disbursement_rejected'
      }
    ];
  }

  onTabChange(activeItem: MenuItem): void {
    this.activeTab = activeItem;
    this.currentRequestType = activeItem.id as LoanRequestType;
    this.currentPage = 1; // Reset to first page
    this.term = ''; // Clear search
    this.fetchLoans();
  }

  fetchLoans(page: number = this.currentPage, size: number = this.pageSize): void {
    this.loanService
      .fetchLoansByRequestType(this.currentRequestType, page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(`Fetched ${this.currentRequestType} loans:`, response);
          this.loans = response.loans;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error(`Failed to fetch ${this.currentRequestType} loans:`, err);
        },
      });
  }

  searchLoans(): void {
    if (this.term.trim()) {
      this.loanService
        .searchLoansByRequestType(this.currentRequestType, this.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.loans = data.loans || data;
            this.totalRecords = this.loans.length;
          },
          error: (err) => {
            console.error('Error searching loans:', err);
          }
        });
    } else {
      this.fetchLoans();
    }
  }

  viewLoan(id: string): void {
    this.router.navigate(['loan-view', id]);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchLoans(this.currentPage, this.pageSize);
  }

  // Helper methods for status display
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'fsp_received': 'FSP Received',
      'fsp_accepted': 'FSP Accepted',
      'fsp_rejected': 'FSP Rejected',
      'employee_rejected': 'Employee Rejected',
      'hro_approved': 'HRO Approved',
      'hro_rejected': 'HRO Rejected',
      'disbursement_approved': 'Disbursement Approved',
      'disbursement_rejected': 'Disbursement Rejected'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
    const severityMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'fsp_received': 'info',
      'fsp_accepted': 'success',
      'fsp_rejected': 'danger',
      'employee_rejected': 'danger',
      'hro_approved': 'success',
      'hro_rejected': 'danger',
      'disbursement_approved': 'success',
      'disbursement_rejected': 'danger'
    };
    return severityMap[status] || 'info';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
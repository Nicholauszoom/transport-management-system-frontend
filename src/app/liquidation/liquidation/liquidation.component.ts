import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanDto } from '../../../dtos/loan.dto';
import { Subject, takeUntil } from 'rxjs';
import { LoanService } from '../../../services/loan.service';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoanRequestType } from '../../loan/loan.component';

@Component({
  selector: 'app-liquidation',
  standalone: true,
  imports: [ MenuComponent,
          TableModule,
          DropdownModule,
          InputTextModule,
          ReactiveFormsModule,
          CommonModule,
          ButtonModule,
          FormsModule,
          CardModule,
          TabMenuModule],
  templateUrl: './liquidation.component.html',
  styleUrl: './liquidation.component.css'
})
export class LiquidationComponent implements OnInit, OnDestroy {
  loans: LoanDto[] = [];
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;
 term: string = '';
 requestType: string = 'loan_liquidated';
loading: boolean = false;
currentRequestType: string = 'loan_liquidated';
  private destroy$ = new Subject<void>();
 tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;

  constructor(
    private loanService: LoanService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans(page: number = this.currentPage, size: number = this.pageSize): void {
    this.loanService
      .fetchLiquidatedLoans(this.currentRequestType, page, size)
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

  //   searchLoans(): void {
  //   if (this.term.trim()) {
  //     this.loanService
  //       .searchLoansByRequestType(this.term)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (data) => {
  //           this.loan = data.loans || data;
  //           this.totalRecords = this.loan.length;
  //         },
  //         error: (err) => {
  //           console.error('Error searching loans:', err);
  //         }
  //       });
  //   } else {
  //     this.fetchLoan();
  //   }
  // }

   searchLoans() {
    this.loanService.searchLoans(this.term).subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (err) => {
        console.error('Error fetching loans:', err);
      }
    });
  }


  viewLoan(id: string): void {
    this.router.navigate(['loan-view', id]);
  }

  goToSendLiquidation() {
    this.router.navigate(['liquidation-create']);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchLoans(this.currentPage, this.pageSize);
  }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
}
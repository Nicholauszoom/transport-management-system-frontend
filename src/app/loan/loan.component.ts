import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LoanDto } from '../../dtos/loan.dto';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent implements OnInit {
  loan: LoanDto[] = [];
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private loanService: LoanService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchLoan();
  }

  fetchLoan(page: number = this.currentPage, size: number = this.pageSize) {
    this.loanService.fetchLoans(page, size);
    this.loanService.loans$.subscribe(data => {
      this.loan = data;
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchLoan(this.currentPage, this.pageSize);
  }

 
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BorrowerDto } from '../../../dtos/borrower.dto';
import { BorrowerService } from '../../../services/borrower.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-borrower',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
  borrowers: BorrowerDto[] = [];
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private borrowerService: BorrowerService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchBorrowers();
  }

  fetchBorrowers(page: number = this.currentPage, size: number = this.pageSize) {
    this.borrowerService.fetchBorrowers(page, size);
    this.borrowerService.borrowers$.subscribe(data => {
      this.borrowers = data; // This should be the actual array of borrowers
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG pagination is zero-based index
    this.pageSize = event.rows;
    this.fetchBorrowers(this.currentPage, this.pageSize);
  }

  goToCreateBorrower() {
    this.router.navigate(['create-borrower']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BorrowerDto } from '../../../dtos/borrower.dto';
import { BorrowerService } from '../../../services/borrower.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormBuilder and FormGroup
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
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
  filteredBorrowers: BorrowerDto[] = []; // Filtered list for the table
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;
  searchForm: FormGroup; // Reactive form for search input

  constructor(
    private borrowerService: BorrowerService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder // Import FormBuilder
  ) {
    // Initialize reactive form
    this.searchForm = this.fb.group({
      searchQuery: [''] // Initialize form control with an empty string
    });
  }

  ngOnInit(): void {
    this.fetchBorrowers();
    
    // Subscribe to form value changes to apply filter in real-time
    this.searchForm.get('searchQuery')?.valueChanges.subscribe(value => {
      this.applyFilter();
    });
  }

  fetchBorrowers(page: number = this.currentPage, size: number = this.pageSize) {
    this.borrowerService.fetchBorrowers(page, size);
    this.borrowerService.borrowers$.subscribe(data => {
      this.borrowers = data; // This should be the actual array of borrowers
      this.applyFilter(); // Apply filter whenever data is fetched
    });
  }

  applyFilter() {
    const searchQuery = this.searchForm.get('searchQuery')?.value.toLowerCase() || '';

    if (searchQuery) {
      this.filteredBorrowers = this.borrowers
        .filter(borrower =>
          borrower.firstName.toLowerCase().includes(searchQuery) ||
          borrower.middleName.toLowerCase().includes(searchQuery) ||
          borrower.lastName.toLowerCase().includes(searchQuery) ||
          borrower.NIN.toLowerCase().includes(searchQuery) ||
          borrower.bankAccountNumber.toLowerCase().includes(searchQuery)
        )
        .sort((a, b) => {
          // Sort to place the matches at the top
          const aMatch = this.matchScore(a, searchQuery);
          const bMatch = this.matchScore(b, searchQuery);
          return bMatch - aMatch; // Higher match score comes first
        });
    } else {
      this.filteredBorrowers = this.borrowers;
    }
  }

  matchScore(borrower: BorrowerDto, query: string): number {
    let score = 0;
    if (borrower.firstName.toLowerCase().includes(query)) score += 1;
    if (borrower.middleName.toLowerCase().includes(query)) score += 1;
    if (borrower.lastName.toLowerCase().includes(query)) score += 1;
    if (borrower.NIN.toLowerCase().includes(query)) score += 1;
    if (borrower.bankAccountNumber.toLowerCase().includes(query)) score += 1;
    return score;
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

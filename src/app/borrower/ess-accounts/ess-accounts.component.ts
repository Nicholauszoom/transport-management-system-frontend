import { Component, OnInit } from '@angular/core';
import { AccountDto } from '../../../dtos/account.dto';
import { EssAccountsService } from '../../../services/ess-accounts-service.service';
import { Router } from '@angular/router';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ess-accounts',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './ess-accounts.component.html',
  styleUrls: ['./ess-accounts.component.css']
})
export class EssAccountsComponent implements OnInit {
  accounts: AccountDto[] = [];
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private essAccountService: EssAccountsService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(page: number = this.currentPage, size: number = this.pageSize) {
    this.essAccountService.fetchAccounts(page, size);
    // Assuming `fetchAccounts` method updates `accountsSubject` with paginated data
    this.essAccountService.accounts$.subscribe(data => {
      this.accounts = data; // This should be the actual array of accounts
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG pagination is zero-based index
    this.pageSize = event.rows;
    this.fetchAccounts(this.currentPage, this.pageSize);
  }

  goToCreateAccount() {
    this.router.navigate(['upload-accounts']);
  }
}

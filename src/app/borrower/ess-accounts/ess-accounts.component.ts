import { Component, OnInit } from '@angular/core';
import { AccountDto } from '../../../dtos/account.dto';
import { HttpClient } from '@angular/common/http';
import { EssAccountsService } from '../../../services/ess-accounts-service.service';
import { Router } from '@angular/router';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ess-accounts',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './ess-accounts.component.html',
  styleUrl: './ess-accounts.component.css'
})
export class EssAccountsComponent implements OnInit{

  accounts: AccountDto [];
  

  public constructor(private http:HttpClient, private essAccountService: EssAccountsService, private router: Router) {
    this.accounts = [];
  }

  ngOnInit(): void {
    this.essAccountService.accounts$.subscribe(accounts => {
      this.accounts = this.accounts;
      
    });

    this.essAccountService.fetchAccounts();
  }

  goToCreateAccount() {
    this.router.navigate(['upload-accounts']);
   }

}

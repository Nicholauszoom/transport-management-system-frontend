import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../services/dashboard.service';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule],
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalProducts = 0;
  totalLoans = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardStats().subscribe(stats => {
      this.totalUsers = stats.users;
      this.totalProducts = stats.products;
      this.totalLoans = stats.loans;
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChargeDto } from '../../../dtos/charge.dto';
import { Subject, takeUntil } from 'rxjs';
import { ChargeService } from '../../../services/charge.service';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-charge-list',
  standalone: true,
  imports: [ MenuComponent,
      TableModule,
      DropdownModule,
      InputTextModule,
      ReactiveFormsModule,
      CommonModule,
      ButtonModule,
      FormsModule,
      CardModule],
  templateUrl: './charge-list.component.html',
  styleUrl: './charge-list.component.css'
})
export class ChargeListComponent implements OnInit, OnDestroy {
  charges: ChargeDto[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private chargeService: ChargeService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.chargeService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
      this.loading = progress;
    });
    this.fetchCharges();
  }

  fetchCharges(page: number = this.currentPage, size: number = this.pageSize) {
    this.chargeService
      .fetchCharges(page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Fetched charges:', response);
          this.charges = response.charges;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error('Failed to fetch charges:', err);
        },
      });
  }

   searchCharges() {
    this.chargeService.searchCharges(this.term).subscribe({
      next: (data) => {
        this.charges = data;
      },
      error: (err) => {
        console.error('Error fetching charges:', err);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; 
    this.pageSize = event.rows;
    this.fetchCharges(this.currentPage, this.pageSize);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
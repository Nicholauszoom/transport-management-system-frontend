import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../../services/loan.service';
import { Subject, takeUntil } from 'rxjs';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-loan-view',
  standalone: true,
  imports: [MenuComponent,
        CardModule,
        NgIf,
        DividerModule,
        CurrencyPipe,
        ButtonModule,
        TableModule,
        TabViewModule],
  templateUrl: './loan-view.component.html',
  styleUrl: './loan-view.component.css'
})
export class LoanViewComponent implements OnInit, OnDestroy {
  loan: any = null;
  loanId!: number;
  inProgress = false;
  private destroy$ = new Subject<void>();

  constructor(
    private loanService: LoanService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoan();
  }

  private loadLoan() {
    const loanId = this.route.snapshot.paramMap.get('id');
    if (!loanId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Loan ID not provided' });
      return;
    }

    this.inProgress = true;
    this.loanService.getLoan(loanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Loan fetch response:', response);
         this.loan = response.data ?? response;
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'Loan loaded' });
        },
        error: (error) => {
          console.error('Loan fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load loan' });
        },
      });
  }

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


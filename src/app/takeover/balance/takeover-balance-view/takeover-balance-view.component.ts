import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TakeoverBalanceService } from '../../../../services/takeover-balance.service';
import { MenuComponent } from '../../../partials/main-layout/main-layout.component';

@Component({
  selector: 'app-takeover-balance-view',
  standalone: true,
  imports: [MenuComponent,
          CardModule,
          NgIf,
          DividerModule,
          CurrencyPipe,
          ButtonModule,
          TableModule,
          TabViewModule],
  templateUrl: './takeover-balance-view.component.html',
  styleUrl: './takeover-balance-view.component.css'
})
export class TakeoverBalanceViewComponent implements OnInit, OnDestroy {
  balance: any = null;
  balanceId!: number;
  inProgress = false;
  private destroy$ = new Subject<void>();

  constructor(
    private balanceService: TakeoverBalanceService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  private loadBalance() {
    const balanceId = this.route.snapshot.paramMap.get('id');
    if (!balanceId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'balance ID not provided' });
      return;
    }

    this.inProgress = true;
    this.balanceService.getBalance(balanceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('balance fetch response:', response);
         this.balance = response.data ?? response;
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'balance loaded' });
        },
        error: (error) => {
          console.error('balance fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load balance' });
        },
      });
  }

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChargeService } from '../../../services/charge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-charge-view',
  standalone: true,
  imports: [
      MenuComponent,
      CardModule,
      NgIf,
      DividerModule,
      CurrencyPipe,
      ButtonModule
    ],
  templateUrl: './charge-view.component.html',
  styleUrl: './charge-view.component.css'
})
export class ChargeViewComponent implements OnInit, OnDestroy {
  charge: any = null;
  chargeId!: number;
  inProgress = false;
  private destroy$ = new Subject<void>();

  constructor(
    private chargeService: ChargeService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharge();
  }

  private loadCharge() {
    const chargeId = this.route.snapshot.paramMap.get('id');
    if (!chargeId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Charge ID not provided' });
      return;
    }

    this.inProgress = true;
    this.chargeService.getCharge(chargeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Charge fetch response:', response);
         this.charge = response.data ?? response;
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'Charge loaded' });
        },
        error: (error) => {
          console.error('Charge fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load charge' });
        },
      });
  }

  deleteCharge(id: number): void {
  if (!id) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Charge ID is not defined' });
    return;
  }
  if (confirm('Are you sure you want to delete this charge?')) {
    this.chargeService.deleteCharge(id).subscribe({
      next: () => {
        this.router.navigate(['charge']);
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Charge deleted successfully' });

      },
      error: (error) => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to delete charge' });
      },
    });
  }
}

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

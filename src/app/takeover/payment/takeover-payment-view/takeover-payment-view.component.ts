import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TakeoverPaymentService } from '../../../../services/takeover-payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuComponent } from '../../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogFormComponent } from '../../../common/dialog-form/dialog-form.component';
import { DialogService } from 'primeng/dynamicdialog';

export type PaymentStatus = 'SETTLED' | 'UNSETTLED';

@Component({
  selector: 'app-takeover-payment-view',
  standalone: true,
  imports: [
    MenuComponent,
    CardModule,
    NgIf,
    DividerModule,
    CurrencyPipe,
    ButtonModule,
    TableModule,
    TabViewModule,
    NgClass
  ],
    providers: [DialogService],
  templateUrl: './takeover-payment-view.component.html',
  styleUrl: './takeover-payment-view.component.css'
})
export class TakeoverPaymentViewComponent implements OnInit, OnDestroy {
  payment: any = null;
  paymentId!: number;
  inProgress = false;
  pdfUrl: SafeResourceUrl | null = null;
  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private paymentService: TakeoverPaymentService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadPayment();
  }

  private loadPayment() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (!paymentId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'payment ID not provided' });
      return;
    }

    this.inProgress = true;
    this.paymentService.getPayment(paymentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('payment fetch response:', response);
          this.payment = response.data ?? response;

          // if payment advice exists, convert to PDF URL
          if (this.payment?.paymentAdviceAttachment) {
            this.pdfUrl = this.base64ToPdfUrl(this.payment.paymentAdviceAttachment);
          }

          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'payment loaded' });
          this.inProgress = false;
        },
        error: (error) => {
          console.error('payment fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load payment' });
          this.inProgress = false;
        },
      });
  }

  base64ToPdfUrl(base64: string): SafeResourceUrl {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadPdf() {
    if (!this.payment?.paymentAdviceAttachment) return;

    const byteCharacters = atob(this.payment.paymentAdviceAttachment);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'payment-advice.pdf';
    link.click();
  }

    paymentAcknoledgementAction(paymentId: string, paymentStatus: PaymentStatus): void {
      const actionText = paymentStatus === 'SETTLED' ? 'settle payment' : 'unsettle payment';
      const confirmMessage = `Are you sure you want to ${actionText} thispayment ? Please provide a reason.`;
  
      const ref = this.dialogService.open(DialogFormComponent, {
        header: 'Confirm Action',
        width: '500px',
        data: { actionText, message: confirmMessage }
      });
  
     ref.onClose.subscribe((reason: string | null) => {
    if (reason && reason.trim().length > 0) {
      this.isProcessing = true;
      this.paymentService.paymentAcknoledgementAction(paymentId, paymentStatus, reason).subscribe({
        next: () => {
          this.isProcessing = false;
          this.router.navigate(['takeover-payment-list']);
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Payment ${actionText} successfully`
          });
        },
        error: (error) => {
          this.isProcessing = false;
          let errorMessage = `Failed to ${actionText} payment`;
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.toast.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    } else {
      console.log("Dialog closed without reason, ignoring...");
    }
  });
    }
  
    goBack() {
    // Navigate back logic
    this.router.navigate(['/takeover-payment-list']);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

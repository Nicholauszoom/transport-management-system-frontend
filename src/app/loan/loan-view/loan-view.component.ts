import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../../services/loan.service';
import { Subject, takeUntil } from 'rxjs';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DialogFormComponent } from '../../common/dialog-form/dialog-form.component';
import { DialogService } from 'primeng/dynamicdialog';


export type LoanAction = 'APPROVED' | 'REJECTED';

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
        TabViewModule,
      NgClass],
  providers: [DialogService],
  templateUrl: './loan-view.component.html',
  styleUrl: './loan-view.component.css'
})
export class LoanViewComponent implements OnInit, OnDestroy {
  loan: any = null;
  loanId!: number;
  inProgress = false;
  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private loanService: LoanService,
    private dialogService: DialogService,
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

   loanApproveAction(loanId: string, loanAction: LoanAction): void {
  if (!loanId) {
    this.toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Loan ID is required' 
    });
    return;
  }

  if (!loanAction) {
    this.toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Loan action is not defined' 
    });
    return;
  }

  // Enhanced confirmation with action-specific messaging
  const actionText = loanAction === 'APPROVED' ? 'approve' : 'reject';
  const confirmMessage = `Are you sure you want to ${actionText} this loan application?`;

  if (confirm(confirmMessage)) {
    this.isProcessing = true;

    this.loanService.loanApproveAction(loanId, loanAction).subscribe({
      next: (response) => {
        this.isProcessing = false;
        console.log('Loan action response:', response);
        
        // Navigate back to loans list
        this.router.navigate(['loan']);
        
        // Show success message with specific action
        this.toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `Loan ${actionText}d successfully` 
        });
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Loan action error:', error);
        
        // Enhanced error handling
        let errorMessage = `Failed to ${actionText} loan`;
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: errorMessage 
        });
      }
    });
  }
}


// loanDisbursementAction
loanDisbursementAction(loanId: string, loanAction: LoanAction): void {
  const actionText = loanAction === 'APPROVED' ? 'approve disbursement' : 'reject disbursement';
    const confirmMessage = `Are you sure you want to ${actionText} this loan application? Please provide a reason.`;

    const ref = this.dialogService.open(DialogFormComponent, {
      header: 'Confirm Loan Action',
      width: '500px',
      data: { actionText, message: confirmMessage }
    });

    ref.onClose.subscribe((reason: string | null) => {
      if (reason !== null) {
        this.isProcessing = true;

        this.loanService.loanDisbursementAction(loanId, loanAction, reason).subscribe({
          next: (response) => {
            this.isProcessing = false;
            this.router.navigate(['loan']);
            this.toast.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: `Loan ${actionText}d successfully`
            });
          },
          error: (error) => {
            this.isProcessing = false;
            let errorMessage = `Failed to ${actionText} loan`;
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            this.toast.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          }
        });
      }
    });
  }


  goBack() {
    // Navigate back logic
    this.router.navigate(['/loan']); // Adjust route as needed
  }

  /**
 * Check if a step is completed based on loan progression
 */
isStepCompleted(stepType: string): boolean {
  const currentType = this.loan?.requestType;
  
  switch (stepType) {
    case 'fsp_received':
      return currentType !== 'fsp_received';
    case 'hro_approved':
      return ['disbursement_approved', 'disbursement_rejected'].includes(currentType || '');
    case 'disbursement_approved':
      return currentType === 'disbursement_approved';
    case 'disbursement_rejected':
      return currentType === 'disbursement_rejected';
    default:
      return false;
  }
}

/**
 * Check if current step is active (current status)
 */
isCurrentStep(stepType: string): boolean {
  return this.loan?.requestType === stepType;
}

/**
 * Get CSS class for status badge
 */
getStatusClass(requestType: string): string {
  return requestType?.replace(/_/g, '-') || '';
}

/**
 * Get human-readable label for status
 */
getStatusLabel(requestType: string): string {
  const labels: { [key: string]: string } = {
    'fsp_received': 'FSP Received',
    'hro_approved': 'HRO Approved',
    'disbursement_approved': 'Disbursement Approved',
    'disbursement_rejected': 'Disbursement Rejected',
    'employee_rejected': 'Employee Rejected'
  };
  
  return labels[requestType] || requestType?.replace(/_/g, ' ').toUpperCase() || 'Unknown Status';
}


    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
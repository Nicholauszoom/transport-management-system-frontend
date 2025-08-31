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
import { TakeoverDialogFormComponent } from '../../common/takeover-dialog-form/takeover-dialog-form.component';


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
  ) { }

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

    const ref = this.dialogService.open(DialogFormComponent, {
      header: 'Confirm Loan Action',
      width: '500px',
      data: { actionText, message: confirmMessage }
    });
    ref.onClose.subscribe((reason: string | null) => {
    if (reason && reason.trim().length > 0) { 
      // if (confirm(confirmMessage)) {
      this.isProcessing = true;

      this.loanService.loanApproveAction(loanId, loanAction).subscribe({
        next: (response) => {
          this.isProcessing = false;
          console.log('Loan action response:', response);

          this.router.navigate(['loan']);

          // ✅ Use backend message if available, otherwise fallback
          const successMessage = (response as any)?.message || `Loan ${actionText}d successfully`;

          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: successMessage
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
    });
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
  if (reason && reason.trim().length > 0) {
    this.isProcessing = true;
    this.loanService.loanDisbursementAction(loanId, loanAction, reason).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['loan']);
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `Loan ${actionText} successfully`
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
  } else {
    console.log("Dialog closed without reason, ignoring...");
  }
});
  }


  // loan takeover disbursement action
  loanTakeoverDisbursementAction(loanId: string, loanAction: LoanAction): void {
  const actionText = loanAction === 'APPROVED' ? 'approve disbursement' : 'reject disbursement';
  const confirmMessage = `Are you sure you want to ${actionText} this loan application? Please provide details.`;

  const ref = this.dialogService.open(TakeoverDialogFormComponent, {
    header: 'Confirm Loan Action',
    width: '500px',
    data: { actionText, message: confirmMessage }
  });

ref.onClose.subscribe((formData: { reason: string; paymentAdvice: string; paymentAdviceAttachment: string } | null) => {
  if (formData) {
    this.isProcessing = true;
    this.loanService.loanTakeoverDisbursementAction(loanId, loanAction, formData).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['loan']);
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `Loan ${actionText} successfully`
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
    } else {
      console.log("Dialog closed without form data, ignoring...");
    }
  });
}




  // loanLiquidationAction
loanLiquidationAction(loanId: string): void {
  const confirmMessage = `Are you sure you want to End Deduction for this loan application? Please provide a reason.`;

  const ref = this.dialogService.open(DialogFormComponent, {
    header: 'Confirm Loan Action',
    width: '500px',
    data: { message: confirmMessage }
  });

  ref.onClose.subscribe((reason: string | null) => {
    if (reason && reason.trim().length > 0) {
      this.isProcessing = true;

      this.loanService.loanLiquidationAction(loanId, reason).subscribe({
        next: () => {
          this.isProcessing = false;
          this.router.navigate(['loan']);
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Loan liquidation completed successfully.`
          });
        },
        error: (error) => {
          this.isProcessing = false;

          let errorMessage = 'Failed to liquidate loan';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.toast.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    } else if (reason !== null) {
      // ✅ user clicked confirm but didn’t type a reason
      this.toast.add({
        severity: 'warn',
        summary: 'Reason Required',
        detail: 'Please provide a reason for liquidation.'
      });
    }
  });
}




  goBack() {
    // Navigate back logic
    this.router.navigate(['/loan']); // Adjust route as needed
  }

  /**
   * Check if a step is completed based on loan progression with branching logic
   */
  isStepCompleted(stepType: string): boolean {
    const currentType = this.loan?.requestType;

    switch (stepType) {
      case 'fsp_received':
        // FSP Received is completed when we move to any next step
        return !['fsp_received'].includes(currentType || '');

      case 'fsp_accepted':
        // FSP Approved is completed when current status is fsp_accepted or beyond (excluding rejected paths)
        return currentType === 'fsp_accepted' ||
          ['hro_approved', 'employee_rejected', 'hro_rejected', 'disbursement_approved', 'disbursement_rejected'].includes(currentType || '');

      case 'fsp_rejected':
        // FSP Rejected is completed when current status is fsp_rejected (terminal state)
        return currentType === 'fsp_rejected';

      case 'employee_rejected':
        // Employee rejected is completed when current status is employee_rejected (terminal state)
        return currentType === 'employee_rejected';

      case 'hro_approved':
        // HRO Approved is completed when we move to disbursement stage
        return ['disbursement_approved', 'disbursement_rejected'].includes(currentType || '');

      case 'hro_rejected':
        // HRO Rejected is completed when current status is hro_rejected (terminal state)
        return currentType === 'hro_rejected';

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
   * Check if process can proceed after a rejection (for future enhancements)
   */
  canProceedAfterRejection(rejectionType: string): boolean {
    // For now, rejections are terminal states
    // This method can be enhanced later if there are appeal/retry mechanisms
    return false;
  }

  /**
   * Get HRO decision label based on current status
   */
  getHRODecisionLabel(): string {
    const currentType = this.loan?.requestType;

    if (currentType === 'employee_rejected') return 'Employee Rejected';
    if (currentType === 'hro_approved' || this.isStepCompleted('hro_approved')) return 'HRO Approved';
    if (currentType === 'hro_rejected') return 'HRO Rejected';

    return 'Pending';
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
      'fsp_accepted': 'FSP Approved',
      'fsp_rejected': 'FSP Rejected',
      'employee_rejected': 'Employee Rejected',
      'hro_approved': 'HRO Approved',
      'hro_rejected': 'HRO Rejected',
      'disbursement_approved': 'Disbursement Approved',
      'disbursement_rejected': 'Disbursement Rejected'
    };

    return labels[requestType] || requestType?.replace(/_/g, ' ').toUpperCase() || 'Unknown Status';
  }

  /**
   * Get the flow path description
   */
  getFlowPath(): string {
    const currentType = this.loan?.requestType;

    const pathMap: { [key: string]: string } = {
      'fsp_received': 'FSP Received → Pending Review',
      'fsp_accepted': 'FSP Received → FSP Approved → Awaiting HRO',
      'fsp_rejected': 'FSP Received → FSP Rejected (Terminal)',
      'employee_rejected': 'FSP Approved → Employee Rejected (Terminal)',
      'hro_approved': 'FSP Approved → HRO Approved → Awaiting Disbursement',
      'hro_rejected': 'FSP Approved → HRO Rejected (Terminal)',
      'disbursement_approved': 'FSP Approved → HRO Approved → Disbursement Approved (Complete)',
      'disbursement_rejected': 'FSP Approved → HRO Approved → Disbursement Rejected (Terminal)'
    };

    return pathMap[currentType || ''] || 'Unknown Path';
  }

  /**
   * Check if the current status represents a terminal state (process ended)
   */
  isTerminalState(): boolean {
    const terminalStates = ['fsp_rejected', 'employee_rejected', 'hro_rejected', 'disbursement_rejected', 'disbursement_approved'];
    return terminalStates.includes(this.loan?.requestType || '');
  }

  /**
   * Get the overall process status
   */
  getProcessStatus(): 'in-progress' | 'completed' | 'rejected' {
    const currentType = this.loan?.requestType;

    if (currentType === 'disbursement_approved') return 'completed';
    if (['fsp_rejected', 'employee_rejected', 'hro_rejected', 'disbursement_rejected'].includes(currentType || '')) return 'rejected';
    return 'in-progress';
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
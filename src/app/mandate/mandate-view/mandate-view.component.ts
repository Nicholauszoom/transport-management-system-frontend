import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MandateServiceService } from '../../../services/mandate-service.service';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';

export type RequestType = 
  | 'UPLOADED' 
  | 'SUBMITTED'
  | 'PRESUBMITTED'
  | 'FAILED';

@Component({
  selector: 'app-mandate-view',
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
    NgClass,
  ],
    providers: [DialogService],
  templateUrl: './mandate-view.component.html',
  styleUrl: './mandate-view.component.css'
})
export class MandateViewComponent implements OnInit, OnDestroy {
  mandate: any = null;
  mandateId!: number;
  inProgress = false;
  pdfUrl: SafeResourceUrl | null = null;
  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private mandateService: MandateServiceService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadMandate();
  }

  private loadMandate () {
    const mandateId = this.route.snapshot.paramMap.get('id');
    if (!mandateId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'mandate ID not provided' });
      return;
    }

    this.inProgress = true;
    this.mandateService.getMandate(mandateId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('mandate fetch response:', response);
          this.mandate = response.data ?? response;

          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'mandate loaded' });
          this.inProgress = false;
        },
        error: (error) => {
          console.error('mandate fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load mandate' });
          this.inProgress = false;
        },
      });
  }

    goBack() {
    // Navigate back logic
    this.router.navigate(['/mandate-list']);
  }

    /**
   * Check if a step is completed based on loan progression with branching logic
   */
  isStepCompleted(stepType: string): boolean {
    const currentType = this.mandate?.mandateRequestType;

    switch (stepType) {
      case 'UPLOADED':
        return ['UPLOADED', 'PRESUBMITTED', 'SUBMITTED', 'FAILED'].includes(currentType);

       case 'PRESUBMITTED':
        return ['PRESUBMITTED', 'SUBMITTED', 'FAILED'].includes(currentType);

      case 'SUBMITTED':
        // SUBMITTED is completed when current status is fsp_accepted or beyond (excluding rejected paths)
        return currentType === 'SUBMITTED' ||
          ['SUBMITTED'].includes(currentType || '');

      case 'FAILED':
        // FAILED is completed when current status is FAILED (terminal state)
        return currentType === 'FAILED';

      default:
        return false;
    }
  }

  /**
   * Check if current step is active (current status)
   */
  isCurrentStep(stepType: string): boolean {
    return this.mandate?.mandateRequestType === stepType;
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
      'UPLOADED': 'Mandate Upload',
      'PRESUBMITTED': 'Mandate Submitted',
      'SUBMITTED': 'Mandate Succeed',
      'FAILED': 'Mandate Failed',
    };

    return labels[requestType] || requestType?.replace(/_/g, ' ').toUpperCase() || 'Unknown Status';
  }

  /**
   * Check if the current status represents a terminal state (process ended)
   */
  isTerminalState(): boolean {
    const terminalStates = ['SUBMITTED', 'FAILED'];
    return terminalStates.includes(this.mandate?.mandateRequestType || '');
  }

  /**
   * Get the overall process status
   */
  getProcessStatus(): 'in-progress' | 'completed' | 'failed' {
    const currentType = this.mandate?.mandateRequestType;

    if (currentType === 'SUBMITTED') return 'completed';
    if (['FAILED'].includes(currentType || '')) return 'failed';
    return 'in-progress';
  }

  /**
   * Get CSS class for status badge icon
   */
  getStatusIcon(): string {
    const currentType = this.mandate?.mandateRequestType;
    switch (currentType) {
      case 'UPLOADED':
        return 'pi-clock';
        case 'PRESUBMITTED':
        return 'pi-check';
      case 'SUBMITTED':
        return 'pi-check-circle';
      case 'FAILED':
        return 'pi-times-circle';
      default:
        return 'pi-info-circle';
    }
  }

  /**
   * Get status text for badge
   */
  getStatusText(): string {
    const processStatus = this.getProcessStatus();
    
    switch (processStatus) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  }

  /**
   * Enhanced flow path with more descriptive messages
   */
  getFlowPath(): string {
    const currentType = this.mandate?.mandateRequestType?.toUpperCase().trim();

    const pathMap: { [key: string]: string } = {
      'UPLOADED': 'Mandate Uploaded → Pending Submission',
      'PRESUBMITTED': 'Uploaded → Submitted → Awaiting CRDB Response',
      'SUBMITTED': 'Uploaded → Submitted → Successfully Submitted to CRDB → Awaiting Processing',
      'FAILED': 'Uploaded → Submitted → Submission Failed → Resubmission Required',
    };
    return pathMap[currentType || ''] || 'Unknown Process Path';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
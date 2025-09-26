import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { MandateServiceService } from '../../../services/mandate-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mandate-create',
  standalone: true,
  imports: [
    MenuComponent,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './mandate-create.component.html',
  styleUrl: './mandate-create.component.css'
})
export class MandateCreateComponent implements OnInit, OnDestroy {

  mandateForm!: FormGroup;
  inProgress = false;
  submitted = false;
  isProcessing = false;
  editMode = false;
  currentMandateId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private mandateService: MandateServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: MessageService,
  ) { }

  frequencyType = [
    { label: 'DAILY', value: 'DAILY' },
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'MONTHLY', value: 'MONTHLY' },
    { label: 'YEARLY', value: 'YEARLY' },
  ];

  ngOnInit(): void {
    this.initForm();

    // Check if URL has an id (edit mode)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.editMode = true;
          this.currentMandateId = +id;
          this.loadMandate(this.currentMandateId);
        }
      });
  }

  private initForm() {
    this.mandateForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      debitAccount: ['', Validators.required],
      totalAmount: ['', Validators.required],
      installmentAmount: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      frequencyType: ['', Validators.required],
      frequency: ['', Validators.required],
      billDetails: [''],
    });
  }

  private loadMandate(id: number) {
    this.mandateService.getMandateById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(mandate => {
        this.mandateForm.patchValue({
          phoneNumber: mandate.phoneNumber,
          debitAccount: mandate.debitAccount,
          totalAmount: mandate.totalAmount,
          installmentAmount: mandate.installmentAmount,
           // Convert "25/12/2025" -> Date
          startDate: this.parseDate(mandate.startDate),
          endDate: this.parseDate(mandate.endDate),
          frequencyType: mandate.frequencyType,
          frequency: mandate.frequency,
          billDetails: mandate.billDetails
        });
      });
  }

  createUpdateMndateData(): void {
    this.submitted = true;
    this.mandateForm.markAllAsTouched();


     if (this.mandateForm.invalid) {
      return;
    }
    this.inProgress = true;

    if (this.editMode && this.currentMandateId) {
      // Update existing mandate
      this.mandateService.updateMandate(this.currentMandateId, this.mandateForm.value).subscribe({
          next: () => {
            this.inProgress = false;
            this.mandateForm.reset();
            this.submitted = false;
            this.editMode = false;
            this.currentMandateId = null;
            console.log('Update successful');
            this.toast.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Mandate updated successfully'
            });
            this.router.navigate(['/mandate-list']);
          },
          error: (error) => {
            this.inProgress = false;
            console.error('mandate update error:', error);

            let errorMessage = `Failed to update mandate`;

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
    } else {
      // Create new mandate
      this.mandateService.createMandate(this.mandateForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.inProgress = false;
            console.log('Create successful:', response);
            this.toast.add({
              severity: 'success',
              summary: 'Created',
              detail: 'Mandate created successfully'
            });
            this.router.navigate(['/mandate-list']);
          },
          error: (error) => {
            this.inProgress = false;
            console.error('mandate create error:', error);

            let errorMessage = `Failed to create mandate`;

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


  submitLoanData() {
    this.submitted = true;
    this.mandateForm.markAllAsTouched();

    if (this.mandateForm.invalid) {
      return;
    }

    this.inProgress = true;

    this.mandateService.createMandate(this.mandateForm.value)
      .subscribe({
        next: () => {
          this.inProgress = false;
          this.mandateForm.reset();
          this.submitted = false;
          this.router.navigate(['mandate-create']);
          // Show success message with specific action
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Mandate created successfully`
          });
        },
        error: (error) => {
          this.isProcessing = false;
          console.error('Mandate created action error:', error);

          let errorMessage = 'Failed to Mandate created';

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
  }


  private formatDateForBackend(date: Date): string {
    // Format date as YYYY-MM-DD for backend
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // return `${year}-${month}-${day}`;
    return `${day}-${month}-${year}`;
  }

  private handleError(error: any, operation: string): void {
    let errorMessage = `Failed to ${operation} mandate`;

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage
    });
  }

  private parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // handle "dd/MM/yyyy"
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = +parts[0];
    const month = +parts[1] - 1; // month is 0-based in JS
    const year = +parts[2];
    return new Date(year, month, day);
  }

  // fallback if backend changes to ISO
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
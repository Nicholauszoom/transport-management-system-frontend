import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LoanService } from '../../../services/loan.service';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-liquidation-create',
  standalone: true,
  imports: [MenuComponent,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    DropdownModule],
  templateUrl: './liquidation-create.component.html',
  styleUrl: './liquidation-create.component.css'
})
export class LiquidationCreateComponent implements OnInit, OnDestroy {

  loanForm!: FormGroup;
  inProgress = false;
  submitted = false;
  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router,
    private toast: MessageService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }


  private initForm() {
    this.loanForm = this.fb.group({
      applicationNumber: ['', Validators.required],
      loanNumber: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }

  submitLoanData() {
    this.submitted = true;
    this.loanForm.markAllAsTouched();

    if (this.loanForm.invalid) {
      return;
    }

    this.inProgress = true;

    this.loanService.liquidation(this.loanForm.value)
      .subscribe({
        next: () => {
          this.inProgress = false;
          this.loanForm.reset();
          this.submitted = false;
          this.router.navigate(['loan-liquidation']);
          // Show success message with specific action
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Loan Liquidation successfully`
          });
        },
        error: (error) => {
          this.isProcessing = false;
          console.error('Loan action error:', error);

          let errorMessage = 'Failed to Liquidate loan';

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
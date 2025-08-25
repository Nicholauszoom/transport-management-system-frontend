import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form',
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
    DropdownModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productForm!: FormGroup;
  inProgress = false;
   isProcessing = false;
  submitted = false;
  private destroy$ = new Subject<void>();

  repaymentTypes = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annually', value: 'ANNUALLY' },
  ];

  currencies = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'TSH', value: 'TSH' },
    { label: 'KES', value: 'KES' },
    { label: 'ZAR', value: 'ZAR' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toast: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.productForm = this.fb.group({
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      minimumTenure: [null, [Validators.required, Validators.min(1)]],
      maximumTenure: [null, [Validators.required, Validators.min(1)]],
      minLoanAmount: [null, Validators.required],
      maxLoanAmount: [null, Validators.required],
      productDescription: [''],
      processFee: [null, Validators.required],
      otherCharges: [null, Validators.required],
      repaymentType: ['', Validators.required],
      forExecutive: [false],
      action: ['REGISTER'],
      interestRate: [null, Validators.required],
      insurance: [null, Validators.required],
      currency: ['', Validators.required]
    });
  }

submitProductData() {
  this.submitted = true;
  this.productForm.markAllAsTouched();

  if (this.productForm.invalid) {
    return;
  }

  this.inProgress = true;

  this.productService.createProduct(this.productForm.value)
    .subscribe({
      next: () => {
        this.inProgress = false;
        this.productForm.reset();
        this.submitted = false;
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
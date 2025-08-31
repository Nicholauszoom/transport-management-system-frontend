import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-takeover-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
  ],
 template: `
  <div class="p-fluid">
    <h3 class="mb-3">{{ config.data.actionText | titlecase }}</h3>
    <p class="mb-4">{{ config.data.message }}</p>

    <!-- Reason -->
    <div class="p-3 mb-3 border-round surface-100">
      <label class="block font-semibold mb-2">Reason</label>
      <textarea [(ngModel)]="reason"
                rows="4"
                placeholder="Enter reason..."
                class="w-full p-inputtext"></textarea>
    </div>

    <!-- Payment Advice -->
    <div class="p-3 mb-3 border-round surface-100">
      <label class="block font-semibold mb-2">Payment Advice</label>
      <input type="text"
             [(ngModel)]="paymentAdvice"
             placeholder="Enter Payment Advice..."
             class="w-full p-inputtext" />
    </div>

    <!-- File Upload -->
    <div class="p-3 mb-3 border-round surface-100">
      <label class="block font-semibold mb-2">Upload PDF</label>
      <input type="file"
             accept="application/pdf"
             (change)="onFileSelected($event)"
             class="w-full" />
      <div *ngIf="fileName" class="mt-2 text-sm text-gray-600">
        Selected: {{ fileName }}
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <button pButton type="button"
              label="Cancel"
              severity="secondary"
              (click)="ref.close(null)">
      </button>

      <button pButton type="button"
              label="Submit"
              severity="primary"
              (click)="submit()"
              [disabled]="!reason || !paymentAdvice || !fileName">
      </button>
    </div>
  </div>
`
})
export class TakeoverDialogFormComponent {
  reason: string = '';
  paymentAdvice: string = '';
  pdfFile: File | null = null;
  fileName: string = '';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.pdfFile = file;
        this.fileName = file.name;
      } else {
        alert('Only PDF files are allowed');
      }
    }
  }

  async submit() {
    if (!this.reason || !this.paymentAdvice || !this.pdfFile) {
      return;
    }

    // Convert PDF → Base64
    const base64String = await this.convertFileToBase64(this.pdfFile);

    this.ref.close({
      reason: this.reason,
      paymentAdvice: this.paymentAdvice,
      paymentAdviceAttachment: base64String
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove prefix: "data:application/pdf;base64,..."
        const result = (reader.result as string);
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

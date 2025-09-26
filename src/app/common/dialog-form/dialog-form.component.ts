import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms'; 
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common'; 
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dialog-form',
  standalone: true,
  imports: [
    CommonModule,         
    FormsModule,          
    CardModule,
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <div class="p-fluid">
      <h3 class="mb-3">{{ config.data.actionText | titlecase }}</h3>
      <p>{{ config.data.message }}</p>
            
      <div class="flex justify-content-end gap-2 mt-4">
         <div class="button-group">
        <button pButton type="button" 
                [label]="config.data.actionText | titlecase" 
                severity="primary" 
                (click)="onConfirm()">
        </button>

        <button pButton type="button" 
                label="Cancel" 
                severity="secondary" 
                (click)="onCancel()">
        </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dialog-form.component.css'
})
export class DialogFormComponent {
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  onConfirm() {
    this.ref.close(true); // Return boolean true for confirmation
  }

  onCancel() {
    this.ref.close(false); // Return boolean false for cancellation
  }
}
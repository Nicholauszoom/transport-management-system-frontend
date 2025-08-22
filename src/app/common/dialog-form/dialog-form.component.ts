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
  selector: 'app-reason-dialog',
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
      
      <textarea [(ngModel)]="reason" rows="4" 
                placeholder="Enter reason..." 
                class="w-full p-inputtext"></textarea>

      <div class="flex justify-content-end gap-2 mt-4">
        <p-button label="Cancel" (click)="ref.close(null)" severity="secondary"></p-button>
        <p-button label="Submit" (click)="ref.close(reason)" severity="primary"></p-button>
      </div>
    </div>
  `
})
export class DialogFormComponent {
  reason: string = '';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}
}

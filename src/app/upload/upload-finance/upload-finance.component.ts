import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FinanceService } from '../../../services/finance.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-upload-finance',
  standalone: true,
 imports: [MenuComponent,
      CardModule,
      ButtonModule,
      FileUploadModule,
      ReactiveFormsModule,
      NgIf,
      ProgressSpinnerModule],
  templateUrl: './upload-finance.component.html',
  styleUrl: './upload-finance.component.css'
})
export class UploadFinanceComponent implements OnInit, OnDestroy {
  fileControl = new FormControl<File | null>(null);
  selectedFileName: string | null = null; 
  inProgress: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private fanancialService: FinanceService,
    private toast: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fanancialService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
      this.inProgress = progress;
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.fileControl.setValue(file);
    this.selectedFileName = file?.name || null;
    console.log('Selected file:', file?.name);
  }

  uploadFile() {
  const file = this.fileControl.value;
  if (!file) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first' });
    return;
  }

  this.fanancialService.uploadFile(file).subscribe({
    next: (response) => {
      // Show success toast here after everything is confirmed successful
      this.toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: response?.message || 'File uploaded successfully' 
      });
      
      this.fileControl.reset(); // Clear file input
      this.selectedFileName = null;
      console.log('Upload completed successfully:', response);
      this.router.navigate(['/mandate-list']);
    },
    error: (error) => {
      // Error already handled in service, but you can add component-specific error handling here if needed
      console.error('Component level error:', error);
      // Optional: Add a fallback error toast if service didn't handle it
      // this.toast.add({ severity: 'error', summary: 'Error', detail: 'Upload failed. Please try again.' });
    },
  });
}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
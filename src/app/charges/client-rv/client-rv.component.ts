import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subject, takeUntil } from 'rxjs';
import { ClientRvService } from '../../../services/client-rv.service';

@Component({
  selector: 'app-client-rv',
  standalone: true,
    imports: [
      MenuComponent,
      CardModule,
      ButtonModule,
      FileUploadModule,
      ReactiveFormsModule,
      NgIf,
      ProgressSpinnerModule,
    ],
  templateUrl: './client-rv.component.html',
  styleUrl: './client-rv.component.css'
})
export class ClientRvComponent implements OnInit, OnDestroy {
  fileControl = new FormControl<File | null>(null);
  selectedFileName: string | null = null; 
  inProgress: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private clientRvSerice: ClientRvService) {}

  ngOnInit(): void {
    this.clientRvSerice.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
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
    if (!file) return;

    this.clientRvSerice.uploadFile(file).subscribe({
      next: () => {
        this.fileControl.reset(); // Clear file input
        this.selectedFileName = null;
      },
      error: () => {
        // Error handled in service
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
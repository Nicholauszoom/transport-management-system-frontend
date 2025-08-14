import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuComponent } from "../../partials/main-layout/main-layout.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Subject, takeUntil } from "rxjs";
import { PriceScheduleService } from "../../../services/price-schedule.service";
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-price-schedule',
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
  templateUrl: './price-shedule.component.html',
  styleUrl: './price-shedule.component.css'
})
export class PriceSheduleComponent implements OnInit, OnDestroy {
  fileControl = new FormControl<File | null>(null);
  selectedFileName: string | null = null; 
  inProgress: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private priceScheduleService: PriceScheduleService) {}

  ngOnInit(): void {
    this.priceScheduleService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
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

    this.priceScheduleService.uploadFile(file).subscribe({
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
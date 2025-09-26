// mandate-report.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { ReportService } from '../../../services/report.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MandateDetailsDialogComponent } from '../../dialog/mandate-details-dialog/mandate-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from "../../partials/main-layout/main-layout.component";
import { ButtonModule } from 'primeng/button';

export interface MandateReportDto {
  id: number;
  partnerId: string;
  phoneNumber: string;
  debitAccount: string;
  totalAmount: number;
  installmentAmount: number;
  startDate: string;
  endDate: string;
  frequencyType: string;
  frequency: number;
  billDetails: string;
  mandateRequestType: string;
  statusCode: string;
  responseDescription: string;
  errorCode: string;
  errorMessage: string;
  submittedDate: string;
  createdDate: string;
  status: string;
  failureReason: string;
}

export interface ReportSummary {
  totalMandates: number;
  successMandates: number;
  failedMandates: number;
  pendingMandates: number;
  successRate: number;
  totalAmount: number;
  successAmount: number;
  reportDate: string;
}

@Component({
  selector: 'app-mandate-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material Modules
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MenuComponent,
    ButtonModule
],
  templateUrl: './mandate-report.component.html',
  styleUrl: './mandate-report.component.css'
})
export class MandateReportComponent implements OnInit {
  filterForm: FormGroup;
  reportSummary: ReportSummary | null = null;
  
  // Data sources for different reports
  successDataSource = new MatTableDataSource<MandateReportDto>();
  failedDataSource = new MatTableDataSource<MandateReportDto>();
  allDataSource = new MatTableDataSource<MandateReportDto>();
  
  // Table columns
  displayedColumns = [
    'id', 'partnerId', 'phoneNumber', 'debitAccount', 
    'totalAmount', 'status', 'createdDate', 'actions'
  ];
  
  detailColumns = [
    'id', 'partnerId', 'phoneNumber', 'debitAccount', 
    'totalAmount', 'installmentAmount', 'frequencyType', 
    'status', 'statusCode', 'errorMessage', 'createdDate'
  ];
  
  // Loading states
  isLoadingSummary = false;
  isLoadingSuccess = false;
  isLoadingFailed = false;
  isLoadingAll = false;
  
  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  
  // Current active tab
  activeTab = 'summary';

  constructor(
    private fb: FormBuilder,
    private mandateReportService: ReportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadReportSummary();
    this.loadAllReports();
  }

  onFilterChange(): void {
    this.loadReportSummary();
    this.loadAllReports();
  }

  loadReportSummary(): void {
    this.isLoadingSummary = true;
    const { startDate, endDate } = this.filterForm.value;
    
    this.mandateReportService.getReportSummary(startDate, endDate)
      .subscribe({
        next: (summary) => {
          this.reportSummary = summary;
          this.isLoadingSummary = false;
        },
        error: (error) => {
          console.error('Error loading report summary:', error);
          this.showError('Failed to load report summary');
          this.isLoadingSummary = false;
        }
      });
  }

  loadAllReports(): void {
    this.loadSuccessReport();
    this.loadFailedReport();
    this.loadAllMandatesReport();
  }

  loadSuccessReport(): void {
    this.isLoadingSuccess = true;
    const { startDate, endDate } = this.filterForm.value;
    
    this.mandateReportService.getSuccessMandatesReport(startDate, endDate, 0, 50)
      .subscribe({
        next: (data) => {
          this.successDataSource.data = data;
          this.isLoadingSuccess = false;
        },
        error: (error) => {
          console.error('Error loading success report:', error);
          this.showError('Failed to load success mandates');
          this.isLoadingSuccess = false;
        }
      });
  }

  loadFailedReport(): void {
    this.isLoadingFailed = true;
    const { startDate, endDate } = this.filterForm.value;
    
    this.mandateReportService.getFailedMandatesReport(startDate, endDate, 0, 50)
      .subscribe({
        next: (data) => {
          this.failedDataSource.data = data;
          this.isLoadingFailed = false;
        },
        error: (error) => {
          console.error('Error loading failed report:', error);
          this.showError('Failed to load failed mandates');
          this.isLoadingFailed = false;
        }
      });
  }

  loadAllMandatesReport(): void {
    this.isLoadingAll = true;
    const { startDate, endDate } = this.filterForm.value;
    
    this.mandateReportService.getAllMandatesReport(startDate, endDate, 0, 50)
      .subscribe({
        next: (data) => {
          this.allDataSource.data = data;
          this.isLoadingAll = false;
        },
        error: (error) => {
          console.error('Error loading all mandates report:', error);
          this.showError('Failed to load all mandates');
          this.isLoadingAll = false;
        }
      });
  }

  exportReport(reportType: string, format: string): void {
    const { startDate, endDate } = this.filterForm.value;
    
    this.mandateReportService.exportReport(reportType, format, startDate, endDate)
      .subscribe({
        next: (data: Blob) => {
          const filename = `mandate_report_${reportType}.${format}`;
          saveAs(data, filename);
          this.showSuccess(`Report exported successfully as ${filename}`);
        },
        error: (error) => {
          console.error('Error exporting report:', error);
          this.showError('Failed to export report');
        }
      });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  viewDetails(mandate: MandateReportDto): void {
    const dialogRef = this.dialog.open(MandateDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: mandate
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        // Refresh data if mandate was updated
        this.loadAllReports();
        this.loadReportSummary();
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'green';
      case 'FAILED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'gray';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'status-success';
      case 'FAILED':
        return 'status-failed';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
}
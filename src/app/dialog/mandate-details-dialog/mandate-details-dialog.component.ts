// mandate-details-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MandateReportDto } from '../../report/mandate-report/mandate-report.component';


@Component({
  selector: 'app-mandate-details-dialog',
  templateUrl: './mandate-details-dialog.component.html',
  styleUrls: ['./mandate-details-dialog.component.scss']
})
export class MandateDetailsDialogComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<MandateDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MandateReportDto
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a snackbar here if needed
    });
  }
}
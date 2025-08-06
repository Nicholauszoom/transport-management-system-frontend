import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LogsDto } from '../../dtos/logs.dto';
import { LogsServiceTsService } from '../../services/logs.service.ts.service';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent  implements OnInit {
    logs: LogsDto[] = [];
    totalRecords: number = 0; // Total number of records for pagination
    currentPage: number = 1;
    pageSize: number = 10;


constructor(
  private logsService: LogsServiceTsService,
  private router: Router,
  private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
) {}

ngOnInit(): void {
  this.fetchLogs();
}
fetchLogs(page: number = this.currentPage, size: number = this.pageSize) {
  this.logsService.fetchLogs(page, size);
  // Assuming `fetchAccounts` method updates `accountsSubject` with paginated data
  this.logsService.logs$.subscribe(data => {
    this.logs = data; // This should be the actual array of accounts
  });
}

onPageChange(event: any) {
  this.currentPage = event.page + 1; // PrimeNG pagination is zero-based index
  this.pageSize = event.rows;
  this.fetchLogs(this.currentPage, this.pageSize);
}


}
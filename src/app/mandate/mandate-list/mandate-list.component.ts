import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MandateDto } from '../../../dtos/mandate.dto';
import { MandateServiceService } from '../../../services/mandate-service.service';
export type RequestType = 
  | 'UPLOADED' 
  | 'SUBMITTED'
  | 'FAILED';

@Component({
  selector: 'app-mandate-list',
  standalone: true,
   imports: [MenuComponent,
          TableModule,
          DropdownModule,
          InputTextModule,
          ReactiveFormsModule,
          CommonModule,
          ButtonModule,
          FormsModule,
          CardModule,
          TabMenuModule],
  templateUrl: './mandate-list.component.html',
  styleUrl: './mandate-list.component.css'
})
export class MandateListComponent implements OnInit, OnDestroy {
  mandates: MandateDto[] = [];
  selectedMandates: MandateDto[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  term: string = '';
  loading: boolean = false;
  
  // Tab management
  tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;
  currentRequestType: RequestType = 'UPLOADED';
  
  private destroy$ = new Subject<void>();

  constructor(
    private mandateService: MandateServiceService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {
    this.initializeTabs();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    this.mandateService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => {
        this.loading = progress;
      });

    // Set default active tab and fetch initial data
    this.activeTab = this.tabItems[0];
    this.fetchMandates();
  }

  private initializeTabs(): void {
    this.tabItems = [
      {
        label: 'Uploaded Mandate',
        icon: 'pi pi-inbox',
        id: 'UPLOADED'
      },
      {
        label: 'Submitted Mandate',
        icon: 'pi pi-check-circle',
        id: 'SUBMITTED'
      },
      {
        label: 'Failed Mandate',
        icon: 'pi pi-times-circle',
        id: 'FAILED'
      }
    ];
  }

  onTabChange(activeItem: MenuItem): void {
    this.activeTab = activeItem;
    this.currentRequestType = activeItem.id as RequestType;
    this.currentPage = 1; 
    this.term = '';
    this.fetchMandates();
  }

  fetchMandates(page: number = this.currentPage, size: number = this.pageSize): void {
    this.mandateService
      .fetchMandatesByRequestType(this.currentRequestType, page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(`Fetched ${this.currentRequestType} mandates:`, response);
          this.mandates = response.mandates;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error(`Failed to fetch ${this.currentRequestType} mandates:`, err);
        },
      });
  }

  searchMandates(): void {
    if (this.term.trim()) {
      this.mandateService
        .searchMandatesByRequestType(this.currentRequestType, this.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.mandates = data.mandates || data;
            this.totalRecords = this.mandates.length;
          },
          error: (err) => {
            console.error('Error searching mandates:', err);
          }
        });
    } else {
      this.fetchMandates();
    }
  }

  viewMandates(id: string): void {
    this.router.navigate(['view-mandate', id]);
  }


onPageChange(event: any) {
  this.currentPage = event.first / event.rows + 1;
  this.pageSize = event.rows;
  this.fetchMandates(this.currentPage, this.pageSize);
}


  // Helper methods for status display
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'UPLOADED': 'Uploaded Mandate',
      'SUBMITTED': 'Submitted Mandate',
      'FAILED': 'Failed Mandate'
    };
    return statusMap[status] || status;
  }

  goToCreateMandate() {
     this.router.navigate(['create-mandate']);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
    const severityMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'UPLOADED': 'info',
      'SUBMITTED': 'success',
      'FAILED': 'danger'
    };
    return severityMap[status] || 'info';
  }

   sendSelected(): void {
    if (!this.selectedMandates.length) {
      console.warn("No mandates selected");
      return;
    }

    const ids = this.selectedMandates.map(m => m.id);
    console.log("Sending selected mandate IDs:", ids);

    this.mandateService.sendSelectedMandates(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("Mandates sent successfully:", res);
        },
        error: (err) => {
          console.error("Failed to send mandates:", err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
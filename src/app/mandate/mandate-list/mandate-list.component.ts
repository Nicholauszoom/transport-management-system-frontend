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
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MandateDto } from '../../../dtos/mandate.dto';
import { MandateServiceService } from '../../../services/mandate-service.service';
import { MenuModule } from 'primeng/menu';
import { DialogFormComponent } from '../../common/dialog-form/dialog-form.component';
import { DialogService } from 'primeng/dynamicdialog';
export type RequestType =
  | 'UPLOADED'
  | 'SUBMITTED'
  | 'PRESUBMITTED'
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
    MenuModule,
    TabMenuModule],
     providers: [DialogService],
  templateUrl: './mandate-list.component.html',
  styleUrl: './mandate-list.component.css'
})
export class MandateListComponent implements OnInit, OnDestroy {
  mandates: MandateDto[] = [];
  menuItems: any[] = [];
  selectedMandates: MandateDto[] = [];
  currentPage = 0; // Change to 0-based indexing to match Spring
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  isFirstPage = true;
  isLastPage = true;

  term: string = '';
  loading: boolean = false;
  confirmed: boolean = false;

  // Tab management
  tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;
  currentRequestType: RequestType = 'UPLOADED';

  private destroy$ = new Subject<void>();

  constructor(
    private mandateService: MandateServiceService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private toast: MessageService,
      private dialogService: DialogService,
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
        label: 'Submitted Mandate(sent to CRDB)',
        icon: 'pi pi-check',
        id: 'PRESUBMITTED'
      },
      {
        label: 'Succeed Mandate',
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

  viewMandates(id: number): void {
    this.router.navigate(['view-mandate', id]);
  }
  viewMandate(id: number): void {
    this.router.navigate(['view-mandate', id]);
  }

  editMandate(id: number): void {
    this.router.navigate(['/edit-mandate', id]);
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
      'PRESUBMITTED': 'Submitted to CRDB',
      'SUBMITTED': 'Succeed Mandate',
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
      'PRESUBMITTED': 'info',
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
const actionText = 'Send to CRDB';
     const confirmMessage = `Are you sure you want to ${actionText} these Mandate application(s)?`;
    
        const ref = this.dialogService.open(DialogFormComponent, {
          header: 'Confirm Mandate Action',
          width: '500px',
          data: { actionText, message: confirmMessage }
        });

        ref.onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
    const ids = this.selectedMandates.map(m => m.id);
    console.log("Sending selected mandate IDs:", ids);

    this.mandateService.sendSelectedMandates(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("Mandates sent successfully:", res);
           window.location.reload();
        },
        error: (err) => {
          console.error("Failed to send mandates:", err);
        }
      });
    }
  });
  }

  deleteSelected(): void {
    if (!this.selectedMandates.length) {
      console.warn("No mandates selected");
      return;
    }
   const actionText = 'Delete';
     const confirmMessage = `Are you sure you want to ${actionText} these Mandate application(s)?`;
    
        const ref = this.dialogService.open(DialogFormComponent, {
          header: 'Confirm Mandate Action',
          width: '500px',
          data: { actionText, message: confirmMessage }
        });

        ref.onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {

      const ids = this.selectedMandates.map(m => m.id);
      console.log("Delete selected mandate IDs:", ids);

      this.mandateService.deleteSelectedMandates(ids)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log("Mandates deleted successfully:", res);
            window.location.reload();
          },

          error: (err) => {
            console.error("Failed to send mandates:", err);
          }
        });
    }
  });
  }

  deleteMandate(id: number): void {
    if (!id) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Mandate ID is not defined' });
      return;
    }
    // if (confirm('Are you sure you want to delete this mandate?')) {
     const actionText = 'Delete';
     const confirmMessage = `Are you sure you want to ${actionText} this Mandate application?`;
    
        const ref = this.dialogService.open(DialogFormComponent, {
          header: 'Confirm Mandate Action',
          width: '500px',
          data: { actionText, message: confirmMessage }
        });

        ref.onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {

      this.mandateService.deleteMandete(id).subscribe({

        next: (res) => {
          console.log("Mandates deleted successfully:", res);
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'mandate deleted successfully' });

          window.location.reload();
        },
        error: (error) => {
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to delete mandate' });
        },
      });
    }
  });
  }


  getMenuItems(mandate: any) {
    return [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewMandates(mandate.id)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editMandate(mandate.id)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteMandate(mandate.id)
      }
    ];
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
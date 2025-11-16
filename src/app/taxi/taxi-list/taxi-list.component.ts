import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { TaxiDto } from '../../../dtos/Taxi.dto';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadTaxiService } from '../../../services/upload-taxi.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DialogFormComponent } from '../../common/dialog-form/dialog-form.component';

@Component({
  selector: 'app-taxi-list',
  standalone:true,
  imports : [MenuComponent,
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

  templateUrl: './taxi-list.component.html',
  styleUrl: './taxi-list.component.css'
})
export class TaxiListComponent implements OnInit, OnDestroy {
  taxes: TaxiDto[] = [];
  menuItems: any[] = [];
  selectedTaxes: TaxiDto[] = [];
  // currentPage = 0; // Change to 0-based indexing to match Spring
  // pageSize = 10;
  // totalRecords = 0;
  // totalPages = 0;

  totalRecords: number = 0;
  currentPage: number = 0; // 0-based for Spring Boot
  totalPages: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  isFirstPage = true;
  isLastPage = true;

  term: string = '';
  loading: boolean = false;
  confirmed: boolean = false;

  // Tab management
  tabItems: MenuItem[] = [];
  activeTab: MenuItem | undefined;

  private destroy$ = new Subject<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // MatTable DataSource
  dataSource = new MatTableDataSource<TaxiDto>([]);
  constructor(
    private taxiService: UploadTaxiService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private toast: MessageService,
      private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.taxiService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => {
        this.loading = progress;
      });

    // Set default active tab and fetch initial data
    this.activeTab = this.tabItems[0];
    this.fetchTaxes();
  }

  onTabChange(activeItem: MenuItem): void {
    this.activeTab = activeItem;
    this.currentPage = 0;
    this.term = '';
    this.fetchTaxes();
     // Reset paginator to first page
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }
  fetchTaxes(page: number = this.currentPage, size: number = this.pageSize): void {
    this.taxiService
      .fetchTaxes(page, size, this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.taxes = response.taxes;
          this.totalRecords = response.totalRecords;

           // Update table data source
          this.dataSource.data = response.taxes;
          
          // Update paginator length
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error(`Failed to fetch Taxes:`, err);
        },
      });
  }

  searchTaxes(): void {
    if (this.term.trim()) {
      this.taxiService
        .searchTaxes(this.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.taxes = data.taxes || data;
            this.totalRecords = this.taxes.length;
          },
          error: (err) => {
            console.error('Error searching taxes:', err);
          }
        });
    } else {
      this.fetchTaxes();
    }
  }

  viewTaxi(id: number): void {
    this.router.navigate(['view-taxi', id]);
  }

  editTaxi(id: number): void {
    this.router.navigate(['/edit-taxi', id]);
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.fetchTaxes(this.currentPage, this.pageSize);
  }
   refresh(): void {
    this.fetchTaxes();
  }

  getMenuItems(taxi: any) {
    return [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewTaxi(taxi.id)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editTaxi(taxi.id)
      }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
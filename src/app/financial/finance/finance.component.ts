import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FinancialDto } from '../../../dtos/financial.dto';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanceService } from '../../../services/finance.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
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
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-finance',
  standalone: true,
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
     TabMenuModule,
     TagModule,
    ],
 
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent implements OnInit, OnDestroy {
  finances: FinancialDto[] = [];
  menuItems: any[] = [];
  selectedFinances: FinancialDto[] = [];
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
  dataSource = new MatTableDataSource<FinancialDto>([]);
  constructor(
    private financeService: FinanceService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private toast: MessageService,
      private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.financeService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => {
        this.loading = progress;
      });

    // Set default active tab and fetch initial data
    this.activeTab = this.tabItems[0];
    this.fetchFinances();
  }

  onTabChange(activeItem: MenuItem): void {
    this.activeTab = activeItem;
    this.currentPage = 0;
    this.term = '';
    this.fetchFinances();
     // Reset paginator to first page
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }
  fetchFinances(page: number = this.currentPage, size: number = this.pageSize): void {
    this.financeService
      .fetchFinances(page, size, this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.finances = response.finances;
          this.totalRecords = response.totalRecords;

           // Update table data source
          this.dataSource.data = response.finances;
          
          // Update paginator length
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error(`Failed to fetch Finances:`, err);
        },
      });
  }

  searchFinances(): void {
    if (this.term.trim()) {
      this.financeService
        .searchFinances(this.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.finances = data.finances || data;
            this.totalRecords = this.finances.length;
          },
          error: (err) => {
            console.error('Error searching finances:', err);
          }
        });
    } else {
      this.fetchFinances();
    }
  }

  viewFinance(id: number): void {
    this.router.navigate(['view-finance', id]);
  }

  editFinance(id: number): void {
    this.router.navigate(['/edit-finance', id]);
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.fetchFinances(this.currentPage, this.pageSize);
  }
   refresh(): void {
    this.fetchFinances();
  }

  getMenuItems(finance: any) {
    return [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewFinance(finance.id)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editFinance(finance.id)
      }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
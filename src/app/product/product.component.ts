import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../dtos/product.dto';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MenuComponent,
    TableModule,
    DropdownModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.productService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
      this.loading = progress;
    });
    this.fetchProduct();
  }

  fetchProduct(page: number = this.currentPage, size: number = this.pageSize) {
    this.productService
      .fetchProducts(page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Fetched products:', response);
          this.products = response.products;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error('Failed to fetch products:', err);
        },
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; 
    this.pageSize = event.rows;
    this.fetchProduct(this.currentPage, this.pageSize);
  }

  goToCreateProduct() {
    this.router.navigate(['product-add']);
  }

  viewProduct(id: string) {
    this.router.navigate(['product-view', id]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
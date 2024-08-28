import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule,FormsModule  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  product: Product[] = [];
  totalRecords: number = 0; // Total number of records for pagination
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchProduct();
  }

  fetchProduct(page: number = this.currentPage, size: number = this.pageSize) {
    this.productService.fetchProducts(page, size);
    this.productService.products$.subscribe(data => {
      this.product = data;
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG pagination is zero-based index
    this.pageSize = event.rows;
    this.fetchProduct(this.currentPage, this.pageSize);
  }

  goToCreateProduct() {
    this.router.navigate(['create-product']);
  }
}



import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    MenuComponent,
    CardModule,
    NgIf,
    DividerModule,
    CurrencyPipe,
    ButtonModule
  ],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit, OnDestroy {
  product: any = null;
  productId!: number;
  inProgress = false;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Product ID not provided' });
      return;
    }

    this.inProgress = true;
    this.productService.getProduct(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Product fetch response:', response);
         this.product = response.data ?? response;
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message || 'Product loaded' });
        },
        error: (error) => {
          console.error('Product fetch error:', error);
          this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to load product' });
        },
      });
  }

  decommission(id: number): void {
  if (!id) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Product ID is not defined' });
    return;
  }
  if (confirm('Are you sure you want to decommission this product?')) {
    this.productService.decommissionProduct(id).subscribe({
      next: () => {
        this.router.navigate(['product']);
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Product decommissioned successfully' });

      },
      error: (error) => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to decommission product' });
      },
    });
  }
}
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { env } from '../constants/env.constant';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorToast } from './error.service';
import { Product } from '../dtos/product.dto';
import { DataResponse } from '../dtos/api.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUri: string = env.baseUrl + '/api/product';
  private progressSubject = new BehaviorSubject<boolean>(false);
  inProgress$ = this.progressSubject.asObservable();
  private productSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productSubject.asObservable();
  private editingProduct: Product | null = null;

  constructor(
    private http: HttpClient,
    private toast: MessageService,
    private router: Router,
    private err: ErrorToast
  ) {}

  getProgress() {
    return this.progressSubject.getValue();
  }

  setProgress(progress: boolean) {
    this.progressSubject.next(progress);
  }

  setEditingProduct(product: Product) {
    this.editingProduct = product;
  }

  getEditingProduct() {
    return this.editingProduct;
  }

  getProducts() {
    return this.productSubject.getValue();
  }

  setProducts(products: Product[]) {
    this.productSubject.next(products);
  }

  fetchProducts(page: number = 1, size: number = 10): Observable<{ products: Product[]; totalRecords: number }> {
    const url = `${this.productUri}/list?page=${page}&size=${size}`;
    console.log('Fetching products from:', url);
    this.setProgress(true);
    return this.http.get<Product[]>(url, { withCredentials: true }).pipe(
      map((response) => {
        console.log('Products fetch response:', response);
        const products = response || [];
        const totalRecords = products.length; // Fallback since no metadata from backend
        this.setProducts(products);
        return { products, totalRecords };
      }),
      
      catchError((err) => {
        console.error('Products fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  createProduct(payload: any): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Sending product creation request to:', `${this.productUri}/create`);
    console.log('Request body:', payload);

    return this.http.post<DataResponse>(`${this.productUri}/create`, payload, { withCredentials: true }).pipe(
      tap((res) => {
        const data = res.data;
        const productCreated = `Product Code \nCode: ${data.productCode}\nName: ${data.productName}`;
        this.toast.add({ severity: 'success', summary: 'Success', detail: productCreated });
        this.router.navigate(['product']);
      }),
      catchError((err) => {
        console.error('Product creation error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  updateProduct(id: string, payload: any): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Sending product update request to:', `${this.productUri}/${id}`);
    console.log('Request body:', payload);

    return this.http.put<DataResponse>(`${this.productUri}/${id}`, payload, { withCredentials: true }).pipe(
      tap((res) => {
        const data = res.data;
        const productUpdated = `Product \nCode: ${data.productCode}\nName: ${data.productName}`;
        this.toast.add({ severity: 'success', summary: res.message, detail: productUpdated });
        this.router.navigate(['product']);
      }),
      catchError((err) => {
        console.error('Product update error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  getProduct(id: string): Observable<DataResponse> {
    this.setProgress(true);
    console.log('Fetching product from:', `${this.productUri}/${id}`);

    return this.http.get<DataResponse>(`${this.productUri}/${id}`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Product fetch response:', response);
      }),
      catchError((err) => {
        console.error('Product fetch error:', err);
        this.err.show(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.setProgress(false);
      })
    );
  }

  
decommissionProduct(id: number): Observable<any> {
  return this.http.post<any>(`${this.productUri}/${id}/decommission`, {}, { withCredentials: true }).pipe(
    tap((res) => {
      console.log('Product decommissioned:', res);
    }),
    catchError((err) => {
      console.error('Decommission error:', err);
      this.err.show(err);
      return throwError(() => err);
    })
  );
}

}
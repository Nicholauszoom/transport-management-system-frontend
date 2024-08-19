import { Injectable, OnInit } from "@angular/core";
import { env } from "../constants/env.constant";
import { BehaviorSubject, finalize } from "rxjs";
import { Product } from "../dtos/product.dto";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { ErrorToast } from "./error.service";
import { DataResponse } from "../dtos/api.dto";

// @Injectable({
//     providedIn: 'root',
// })
@Injectable({
        providedIn: 'root',
    })
export class ProductService implements OnInit{
    
    private productUri: string = env.baseUrl+"/api/postal/product/list";
    private fspUri: string = env.baseUrl+"/fsp";

    //Progress set
    private progressSubject = new BehaviorSubject<boolean>(false);  
    inProgress$ = this.progressSubject.asObservable();

    getProgress() {
        return this.progressSubject.getValue();
    }

    setProgress(progress: boolean) {  
        this.progressSubject.next(progress);
    }

     //Editting set
     private editingProduct: any;

     setEditingProduct(product: Product){
         this.editingProduct = product;
     }
 
     getEditingProduct(){
         return this.editingProduct;
     }

     //Product set
    private productSubject = new BehaviorSubject<Product[]>([]);  
    products$ = this.productSubject.asObservable();

    getProducts() {
        return this.productSubject.getValue();
    }

    setProducts(product: Product[]) {  
        this.productSubject.next(product);
    }

    constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {

    }

    ngOnInit(): void {
        this.fetchProducts();
    }

    public fetchProducts(page: number = 1, size: number = 10) {
        this.http.get<DataResponse>(`${this.productUri}?page=${page}&size=${size}`, {withCredentials: true})
        .subscribe(
            {
                next: res => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
                    this.setProducts(res.data);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }


    public createProduct(payload: any){
        this.setProgress(true);
        
        this.http.post<DataResponse>(this.productUri, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let productCreated = "Product Code \nCode: "+data.productCode+"\nName: "+data.productName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: productCreated });
                   
                    this.router.navigate(['products']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }

    
    public updateProduct(id: String, payload: any){
        this.setProgress(true);
        
        this.http.put<DataResponse>(this.productUri+"/"+id, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let productCreated = "Product \nCode: "+data.productCode+"\nName: "+data.productName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: productCreated });
                   
                    // this.router.navigate(['fsp-categories']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }

}
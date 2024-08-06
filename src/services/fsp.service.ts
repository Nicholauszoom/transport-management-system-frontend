import { Injectable, OnInit } from "@angular/core";
import { env } from "../constants/env.constant";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { DataResponse } from "../dtos/api.dto";
import { ErrorToast } from "./error.service";
import { FspCategoryDto } from "../dtos/fsp-category.dto";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class FspService implements OnInit{
    private categoryUri: string = env.baseUrl+"/fsp-categories";
    private branchUri: string = env.baseUrl+"/fsp-branches";
    private fspUri: string = env.baseUrl+"/fsp";

    private categoriesSubject = new BehaviorSubject<FspCategoryDto[]>([]);  
    categories$ = this.categoriesSubject.asObservable();

    getCategories() {
        return this.categoriesSubject.getValue();
    }

    setCategories(categories: FspCategoryDto[]) {  
        this.categoriesSubject.next(categories);
    }

    constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {

    }

    ngOnInit(): void {
        this.fetchCategories();
    }

    public fetchCategories() {
        this.http.get<DataResponse>(this.categoryUri, {withCredentials: true})
        .subscribe(
            {
                next: res => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
                    this.setCategories(res.data);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }

    public createFspCategory(payload: any){
        this.http.post<DataResponse>(this.categoryUri, payload, {withCredentials: true})
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let categoryCreated = "Category \nCode: "+data.categoryCode+"\nName: "+data.categoryName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: categoryCreated });
                   
                    this.router.navigate(['fsp-categories']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }
}
import { Injectable, OnInit } from "@angular/core";
import { env } from "../constants/env.constant";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { DataResponse } from "../dtos/api.dto";
import { ErrorToast } from "./error.service";
import { FspCategoryDto } from "../dtos/fsp-category.dto";
import { BehaviorSubject, finalize } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class FspService implements OnInit{
    private categoryUri: string = env.baseUrl+"/fsp-categories";
    private branchUri: string = env.baseUrl+"/fsp-branches";
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
    private editingFspCategory: any;

    setEditingFspCategory(fspCategory: FspCategoryDto){
        this.editingFspCategory = fspCategory;
    }

    getEditingFspCategory(){
        return this.editingFspCategory;
    }

    //Categories set
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
        this.setProgress(true);
        
        this.http.post<DataResponse>(this.categoryUri, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
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

    public updateFspCategory(id: String, payload: any){
        this.setProgress(true);
        
        this.http.put<DataResponse>(this.categoryUri+"/"+id, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let categoryCreated = "Category \nCode: "+data.categoryCode+"\nName: "+data.categoryName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: categoryCreated });
                   
                    // this.router.navigate(['fsp-categories']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }
}
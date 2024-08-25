import { Injectable, OnInit } from "@angular/core";
import { env } from "../constants/env.constant";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { DataResponse } from "../dtos/api.dto";
import { ErrorToast } from "./error.service";
import { FspCategoryDto } from "../dtos/fsp-category.dto";
import { BehaviorSubject, finalize } from "rxjs";
import { FspDto } from "../dtos/fsp.dto";

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
    private editingFsp: any;

    setEditingFspCategory(fspCategory: FspCategoryDto){
        this.editingFspCategory = fspCategory;
    }

    getEditingFspCategory(){
        return this.editingFspCategory;
    }

    setEditingFsp(fsp: FspDto){
        this.editingFsp = fsp;
    }

    getEditingFsp(){
        return this.editingFsp;
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

    //Fsp set
    private fspSubject = new BehaviorSubject<FspDto[]>([]);
    fsp$ = this.fspSubject.asObservable();

    getFsp() {
        return this.fspSubject.getValue();
    }

    setFsp(fsp: FspDto[]) {  
        this.fspSubject.next(fsp);
    }

    constructor(private http: HttpClient, private toast: MessageService, private router: Router, private err: ErrorToast) {

    }

    ngOnInit(): void {
        this.fetchCategories();
        this.fetchFsp();
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

    public trashFspCategory(id: Int32Array){
        this.setProgress(true);
        
        this.http.delete<DataResponse>(this.categoryUri+"/trash/"+id, {withCredentials: true})
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
                    this.toast.add({ severity: 'warning', summary: res.message, detail: categoryCreated });
                   
                    location.reload();
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }




    // FSP

    public fetchFsp(page: number = 1, size: number = 10) {
        this.http.get<DataResponse>(`${this.fspUri}?page=${page}&size=${size}`, {withCredentials: true})
        .subscribe(
            {
                next: res => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: res.message });
                    this.setFsp(res.data);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }



    public createFsp(payload: any){
        this.setProgress(true);
        
        this.http.post<DataResponse>(this.fspUri, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let fspCreated = "Fsp \nCode: "+data.fspCode+"\nName: "+data.fspName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: fspCreated });
                   
                    this.router.navigate(['fsp']);
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }



    public updateFsp(id: String, payload: any){
        this.setProgress(true);
        
        this.http.put<DataResponse>(this.fspUri+"/"+id, payload, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let fspCreated = "Fsp \nCode: "+data.fspCode+"\nName: "+data.fspName;
                    this.toast.add({ severity: 'success', summary: res.message, detail: fspCreated });
                   
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }

    public trashFsp(id: Int32Array){
        this.setProgress(true);
        
        this.http.delete<DataResponse>(this.fspUri+"/trash/"+id, {withCredentials: true})
        .pipe(
            finalize(() => {
                this.setProgress(false);
            })
        )
        .subscribe(
            {
                next: res => {
                    let data = res.data;
                    let fspCreated = "Fsp \nCode: "+data.fspCode+"\nName: "+data.fspName;
                    this.toast.add({ severity: 'warning', summary: res.message, detail: fspCreated });
                   
                    location.reload();
                },
                error: err => {
                    this.err.show(err);
                }
            }
        );
    }


}
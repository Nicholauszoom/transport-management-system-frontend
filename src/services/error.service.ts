import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ErrorToast {
    public constructor(private toast: MessageService, private router: Router){}

    public show(err: any){
        //Set default message to http client response message
        let message = err.message;

        //If error comes from the backend server then use appropriate message from it
        if(err.status == 401 || err.status == 403){
            this.router.navigate(['/login']);
        } else if(err.status != 0){
            message = err.error.message;
        }

        this.toast.add({ severity: 'error', summary: 'Error occured', detail: message })
    }
}
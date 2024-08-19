import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MenuComponent,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    NgIf
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'] 
})
export class ProductFormComponent implements OnInit {

  product: any;
  submitted = false;
  inProgress = false;
  createMode = true;
  title = "Create";

  // Define FormControls
  productCode = new FormControl("", [Validators.required]);
  productName = new FormControl("", [Validators.required]);
  minimumTenure = new FormControl("", [Validators.required]);
  maximumTenure = new FormControl("", [Validators.required]);
  minimumPrinciple = new FormControl("", [Validators.required]);
  maximumPrinciple = new FormControl("", [Validators.required]);
  interestRate = new FormControl("", [Validators.required]);
  insurance = new FormControl("", [Validators.required]);
  fspId = new FormControl("", [Validators.required]);  
  fspCode = new FormControl("", [Validators.required]); 
  currencyName = new FormControl("", [Validators.required]); 
  productDescription = new FormControl(""); 

  // Initialize the FormGroup
  productForm = new FormGroup({
    productCode: this.productCode,
    productName: this.productName,
    minimumTenure: this.minimumTenure,
    maximumTenure: this.maximumTenure,
    minimumPrinciple: this.minimumPrinciple,
    maximumPrinciple: this.maximumPrinciple,
    interestRate: this.interestRate,
    insurance: this.insurance,
    fspId: this.fspId,
    fspCode: this.fspCode,
    currencyName: this.currencyName,
    productDescription: this.productDescription
  });

  public constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.createMode = location.pathname == "/create-product";
    this.productService.inProgress$.subscribe(progressStatus => {
      this.inProgress = progressStatus;
      this.submitted = false;
  });


}

submitProductData(){
  this.submitted = true;
  
  if(this.productForm.valid){
    const payload = {
      "productCode": this.productCode.value,
      "productName": this.productName.value,
      "minimumTenure": this.minimumTenure.value,
      "maximumTenure": this.maximumTenure.value,
      "minimumPrinciple": this.minimumPrinciple.value,
      "maximumPrinciple": this.maximumPrinciple.value,
      "interestRate": this.interestRate.value,
      "fspId": this.fspId.value,
      "insurance": this.insurance.value,
      "fspCode": this.fspCode.value,
      "currencyName": this.currencyName.value,
      "productDescription": this.productDescription.value
    };

    if(this.createMode){
      this.productService.createProduct(payload);
    } else {
      this.productService.updateProduct(this.product.id, payload);
    }
    
  }
}
}


import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../../partials/main-layout/main-layout.component";
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FspService } from '../../../services/fsp.service';

@Component({
  selector: 'app-fsp-category-form',
  standalone: true,
  imports: [MenuComponent, CardModule, FloatLabelModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './fsp-category-form.component.html',
  styleUrl: './fsp-category-form.component.css'
})
export class FspCategoryFormComponent implements OnInit{
  category: any;
  submitted   = false;
  inProgress  = false;
  createMode  = true;
  title       = "Create";

  code = new FormControl("", [Validators.required]);
  name = new FormControl("", [Validators.required]);

  categoryForm = new FormGroup({
    code: this.code,
    name: this.name
  });

  public constructor(private fspService: FspService){}

  ngOnInit(): void {
    this.createMode = location.pathname == "/create-fsp-category";

    this.fspService.inProgress$.subscribe(progressStatus => {
      this.inProgress = progressStatus;
      this.submitted = false;
      // this.loginForm.reset();
    });

    if(!this.createMode){
      this.title = "Update";
      this.category = this.fspService.getEditingFspCategory();

      this.categoryForm.setValue({
        code: this.category.categoryCode,
        name: this.category.categoryName
      });
    }
  }

  submitFspCategoryData(){
    this.submitted = true;
    
    if(this.categoryForm.valid){
      const payload = {
        "code": this.code.value,
        "name": this.name.value
      };

      if(this.createMode){
        this.fspService.createFspCategory(payload);
      } else {
        this.fspService.updateFspCategory(this.category.id, payload);
      }
      
    }
  }
}

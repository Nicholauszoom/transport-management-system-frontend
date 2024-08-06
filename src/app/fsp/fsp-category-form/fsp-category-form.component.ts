import { Component } from '@angular/core';
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
export class FspCategoryFormComponent {
  submitted   = false;
  inProgress  = false;

  code = new FormControl("", [Validators.required]);
  name = new FormControl("", [Validators.required]);

  createCategoryForm = new FormGroup({
    code: this.code,
    name: this.name
  });

  public constructor(private fspService: FspService){}

  submitFspCategoryData(){
    this.submitted = true;
    
    if(this.createCategoryForm.valid){
      const payload = {
        "code": this.code.value,
        "name": this.name.value
      };

      this.fspService.createFspCategory(payload);
    }
  }
}

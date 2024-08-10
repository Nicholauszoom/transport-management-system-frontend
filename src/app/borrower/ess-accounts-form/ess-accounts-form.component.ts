import { Component } from '@angular/core';
import { MenuComponent } from "../../partials/main-layout/main-layout.component";
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EssAccountsService } from '../../../services/ess-accounts-service.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-borrower-form',
  standalone: true,
  imports: [MenuComponent, CardModule, FloatLabelModule, ButtonModule, ReactiveFormsModule, InputTextModule, NgClass, NgIf],
  templateUrl: './ess-accounts-form.component.html',
  styleUrl: './ess-accounts-form.component.css'
})

export class EssAccountsFormComponent {

  uploadForm: FormGroup;
  submitted = false;
  inProgress = false;

  constructor(private fb: FormBuilder, private essAccountsService: EssAccountsService) {
    this.uploadForm = this.fb.group({
      file: ['', Validators.required]
    });
  }

  get formControls() {
    return this.uploadForm.controls;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({
        file: file
      });
    }
  }

  submitFile() {
    this.submitted = true;

    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('file')?.value);

      // Add other form fields if needed, like checkNumber, accountNumber, etc.
      // formData.append('checkNumber', this.uploadForm.get('checkNumber')?.value);

      this.inProgress = true;
      this.essAccountsService.uploadFile(formData).subscribe({
        next: (response) => {
          console.log('File uploaded successfully!', response);
          this.inProgress = false;
        },
        error: (err) => {
          console.error('File upload failed!', err);
          this.inProgress = false;
        }
      });
    }
  }
}

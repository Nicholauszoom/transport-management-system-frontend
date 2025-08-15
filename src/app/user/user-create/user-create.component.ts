import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserServiceService } from '../../../services/user-service.service';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    MenuComponent,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    DropdownModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit, OnDestroy {

  userForm!: FormGroup;
  inProgress = false;
  submitted = false;
  private destroy$ = new Subject<void>();

  roles = [
    { label: 'ADMINISTRATOR', value: 'ADMIN' },
    { label: 'FINANCE', value: 'FINANCE' },
    { label: 'CREDIT', value: 'CREDIT' },
    { label: 'USER', value: 'USER' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  private initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  submitUserData() {
    this.submitted = true;
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    this.inProgress = true;

    this.userService.createUser(this.userForm.value)
      .subscribe({
        next: () => {
          this.inProgress = false;
          this.userForm.reset();
          this.submitted = false;
        },
        error: () => {
          this.inProgress = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
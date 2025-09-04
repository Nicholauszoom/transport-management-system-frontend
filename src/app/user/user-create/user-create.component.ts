import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

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
  isProcessing = false;
  currentUserId: number | null = null;
  editMode = false;
  private destroy$ = new Subject<void>();

  roles = [
    { label: 'ADMINISTRATOR', value: 'ADMIN' },
    { label: 'FINANCE', value: 'FINANCE' },
    { label: 'CREDIT', value: 'CREDIT' },
    { label: 'USER', value: 'USER' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private route: ActivatedRoute,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();

     //  check if URL has an id (edit mode)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.editMode = true;
          this.currentUserId = +id;
          this.loadUser(this.currentUserId);
        }
      });
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

  private loadUser(id: number) {
    this.userService.getUserById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          password: '' 
        });
      });
  }

  submitUserData() {
    this.submitted = true;
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    this.inProgress = true;

    if (this.editMode && this.currentUserId) {
      this.userService.updateUser(this.currentUserId, this.userForm.value).subscribe({
        next: () => {
          this.inProgress = false;
          this.userForm.reset();
          this.submitted = false;
          this.editMode = false;
          this.currentUserId = null;
        },
        error: () => {
          this.inProgress = false;
        }
      });
    } else {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.inProgress = false;
          this.userForm.reset();
          this.submitted = false;
        },
         error: (error) => {
          this.isProcessing = false;
          console.error('user action error:', error);

          // Enhanced error handling
          let errorMessage = `Failed to user`;

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        }
      });
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-component',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [MessageService],
  imports: [CardModule, ButtonModule, FloatLabelModule, InputTextModule, PasswordModule, ReactiveFormsModule, ToastModule]
})
export class AuthComponent {
  submitted = false;
  inProgress = false;

  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", [Validators.required]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  });

  constructor(private authService: AuthService,
  private fb: FormBuilder,
  private messageService: MessageService,
  private router: Router) {}

  ngOnInit() {
    this.authService.inProgress$.subscribe(progressStatus => {
      this.inProgress = progressStatus;
      if (!this.inProgress && this.submitted) {
        this.loginForm.reset();
        this.submitted = false;
      }
    });
  }

  public login() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const credentials = {
        email: this.email.value,
        password: this.password.value
      };
      
      // Log the request payload here to inspect what’s being sent
      console.log('HTTP POST payload:', credentials);
      
      // Subscribe to handle success/error and log response details
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login success response:', response);
          // Handle success (e.g., navigate to dashboard)
          this.router.navigate(['/dashboard']);
        },
       error: (error) => {
    console.error('Login error response:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error?.error?.message || 'Invalid credentials'
    });
  },
   complete: () => {
    // Reset form or other cleanup
  }
      });
    }
  }
}
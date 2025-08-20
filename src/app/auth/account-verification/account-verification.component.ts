import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  providers: [MessageService],
    imports: [CardModule, ButtonModule, FloatLabelModule, InputTextModule, PasswordModule, ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css'
})
export class AccountVerificationComponent {
 submitted = false;
  inProgress = false;

  email = new FormControl("", [Validators.required, Validators.email]);
  verificationCode = new FormControl("", [Validators.required]);

  verificationForm = new FormGroup({
    email: this.email,
    verificationCode: this.verificationCode
  });

  constructor(private authService: AuthService,
  private fb: FormBuilder,
  private messageService: MessageService,
  private toast: MessageService,
  private router: Router) {}

  ngOnInit() {
    this.authService.inProgress$.subscribe(progressStatus => {
      this.inProgress = progressStatus;
      if (!this.inProgress && this.submitted) {
        this.verificationForm.reset();
        this.submitted = false;
      }
    });
  }


  public verify() {
  this.submitted = true;

  if (this.verificationForm.valid) {
    const credentials = {
      email: this.email.value,
      verificationCode: this.verificationCode.value
    };

    console.log('HTTP POST payload:', credentials);

    this.authService.verify(credentials).subscribe({
      next: (response: string) => {
        console.log('Verification response:', response);
        // Redirect after success
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Verification error response:', error);
        // You can log it, but we won’t show an error toast
      },
      complete: () => {
        // Always show success toast
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account verification process completed'
        });

        // Reset form
        this.verificationForm.reset();
        this.submitted = false;
      }
    });
  }
}

}
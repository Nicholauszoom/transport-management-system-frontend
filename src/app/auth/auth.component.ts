import { Component, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'auth-component',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [CardModule, ButtonModule, FloatLabelModule, InputTextModule, PasswordModule, ReactiveFormsModule, ToastModule]
})

export class AuthComponent {
  submitted   = false;
  inProgress  = false;

  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required]);

  loginForm = new FormGroup({
    username: this.username,
    password: this.password
  });

  public constructor(private authService: AuthService){

  }

  ngOnInit() {
    this.authService.inProgress$.subscribe(progressStatus => {
      this.inProgress = progressStatus;
      this.submitted = false;
      this.loginForm.reset();
    });
  }

  public async login() {
    this.submitted = true;
    
    if(this.loginForm.valid){
      const credentials = {
        "username": this.username.value,
        "password": this.password.value
      };

      this.authService.login(credentials);
    }
  }
}
import { Component, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'auth-component',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [CardModule, ButtonModule, FloatLabelModule, InputTextModule, PasswordModule, ReactiveFormsModule]
})

export class AuthComponent {
  submitted = false;
  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required]);

  loginForm = new FormGroup({
    username: this.username,
    password: this.password
  });

  public login() {
    this.submitted = true;
    
    if(this.loginForm.valid){
      
    } else {
      console.log(this.loginForm);
      console.log(this.loginForm.dirty)
    }
  }
}
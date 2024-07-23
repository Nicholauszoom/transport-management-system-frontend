import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    AppComponent,
    BrowserModule,
    ReactiveFormsModule, // <-- Import ReactiveFormsModule here
    AuthComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }

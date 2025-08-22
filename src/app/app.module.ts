import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { AppComponent } from './app.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    
  ],
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    TabMenuModule,
    OverlayPanelModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
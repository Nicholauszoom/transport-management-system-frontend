import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { FspComponent } from './fsp/fsp.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'fsp', component: FspComponent },
    // { path: 'search', component: SearchComponent },
];

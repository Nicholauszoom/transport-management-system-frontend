import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    // { path: 'profile/:id', component: ProfileComponent },
    // { path: 'search', component: SearchComponent },
];

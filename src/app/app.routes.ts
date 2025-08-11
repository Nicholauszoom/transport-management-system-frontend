import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'profile', component: ProductComponent},
    { path: 'user', component: UserListComponent},
    { path: 'dashboard', component: DashboardComponent}
    // { path: 'search', component: SearchComponent },
];

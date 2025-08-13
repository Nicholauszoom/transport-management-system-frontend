import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductViewComponent } from './product/product-view/product-view.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'profile', component: ProductComponent},
    { path: 'user', component: UserListComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'product', component: ProductComponent},
    { path: 'product-add', component: ProductFormComponent},
    { path: 'product-view/:id', component: ProductViewComponent }
    // { path: 'search', component: SearchComponent },
];

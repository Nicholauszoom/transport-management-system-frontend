import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductViewComponent } from './product/product-view/product-view.component';
import { PriceSheduleComponent } from './charges/price-shedule/price-shedule.component';
import { ClientRvComponent } from './charges/client-rv/client-rv.component';
import { ChargeListComponent } from './charges/charge-list/charge-list.component';
import { ChargeViewComponent } from './charges/charge-view/charge-view.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { AccountVerificationComponent } from './auth/account-verification/account-verification.component';
import { LoanComponent } from './loan/loan.component';
import { LoanViewComponent } from './loan/loan-view/loan-view.component';
import { LiquidationComponent } from './liquidation/liquidation/liquidation.component';
import { LiquidationCreateComponent } from './liquidation/liquidation-create/liquidation-create.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'profile', component: ProductComponent},
    { path: 'user', component: UserListComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'product', component: ProductComponent},
    { path: 'product-add', component: ProductFormComponent},
    { path: 'product-view/:id', component: ProductViewComponent },
    { path: 'price-schedule', component: PriceSheduleComponent },
    { path: 'client-rv', component: ClientRvComponent },
    { path: 'charge', component: ChargeListComponent },
    { path: 'charge-view/:id', component: ChargeViewComponent },
    { path: 'user-add', component: UserCreateComponent },
    { path: 'verify', component: AccountVerificationComponent },
    { path: 'loan', component: LoanComponent },
    { path: 'loan-view/:id', component: LoanViewComponent },
    { path: 'loan-liquidation', component: LiquidationComponent },
    { path: 'liquidation-create', component: LiquidationCreateComponent }, 
    // { path: 'search', component: SearchComponent },
];

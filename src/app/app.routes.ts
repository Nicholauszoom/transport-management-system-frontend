import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { AccountVerificationComponent } from './auth/account-verification/account-verification.component';
import { TaxiListComponent } from './taxi/taxi-list/taxi-list.component';
import { FinanceComponent } from './financial/finance/finance.component';
import { UploadTaxiComponent } from './upload/upload-taxi/upload-taxi.component';
import { UploadFinanceComponent } from './upload/upload-finance/upload-finance.component';



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'user', component: UserListComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'user-add', component: UserCreateComponent },
    { path: 'verify', component: AccountVerificationComponent },
    { path: 'user-edit/:id', component: UserCreateComponent },
    { path: 'taxi-list', component: TaxiListComponent },
    { path: 'finance-list', component: FinanceComponent },
    { path: 'taxi-upload', component: UploadTaxiComponent },
    { path: 'finance-upload', component: UploadFinanceComponent },

];

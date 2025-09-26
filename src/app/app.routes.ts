import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { PriceSheduleComponent } from './charges/price-shedule/price-shedule.component';
import { ClientRvComponent } from './charges/client-rv/client-rv.component';
import { ChargeListComponent } from './charges/charge-list/charge-list.component';
import { ChargeViewComponent } from './charges/charge-view/charge-view.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { AccountVerificationComponent } from './auth/account-verification/account-verification.component';
import { LoanComponent } from './loan/loan.component';
import { LoanViewComponent } from './loan/loan-view/loan-view.component';
import { MandateListComponent } from './mandate/mandate-list/mandate-list.component';
import { MandateUploadComponent } from './mandate/mandate-upload/mandate-upload.component';
import { MandateViewComponent } from './mandate/mandate-view/mandate-view.component';
import { MandateCreateComponent } from './mandate/mandate-create/mandate-create.component';
import { MandateReportComponent } from './report/mandate-report/mandate-report.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'user', component: UserListComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'price-schedule', component: PriceSheduleComponent },
    { path: 'client-rv', component: ClientRvComponent },
    { path: 'user-add', component: UserCreateComponent },
    { path: 'verify', component: AccountVerificationComponent },
    { path: 'mandate-list', component: MandateListComponent },
    { path: 'create-mandate', component: MandateListComponent },
    { path: 'upload-mandate', component: MandateUploadComponent },
    { path: 'view-mandate/:id', component: MandateViewComponent },
    { path: 'user-edit/:id', component: UserCreateComponent },
    { path: 'create-mandate', component: MandateCreateComponent },
    { path: 'edit-mandate/:id', component: MandateCreateComponent },
    { path: 'mandate-report', component: MandateReportComponent },
    // { path: 'search', component: SearchComponent },
];

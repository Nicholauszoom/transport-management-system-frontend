import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { FspCategoryFormComponent } from './fsp/fsp-category-form/fsp-category-form.component';
import { FspCategoriesComponent } from './fsp/fsp-categories/fsp-categories.component';
import { BorrowerComponent } from './borrower/borrower/borrower.component';
import { EssAccountsComponent } from './borrower/ess-accounts/ess-accounts.component';
import { EssAccountsFormComponent } from './borrower/ess-accounts-form/ess-accounts-form.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductComponent } from './product/product.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'create-fsp-category', component: FspCategoryFormComponent },
    { path: 'update-fsp-category', component: FspCategoryFormComponent },
    { path: 'fsp-categories', component: FspCategoriesComponent },
    { path: 'borrowers', component: BorrowerComponent },
    { path: 'accounts', component: EssAccountsComponent},
    { path: 'upload-accounts', component: EssAccountsFormComponent},
    { path: 'app-product', component: ProductComponent},
    { path: 'create-product', component: ProductFormComponent}

    // { path: 'search', component: SearchComponent },
];

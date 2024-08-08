import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { FspCategoryFormComponent } from './fsp/fsp-category-form/fsp-category-form.component';
import { FspCategoriesComponent } from './fsp/fsp-categories/fsp-categories.component';
import { BorrowerComponent } from './borrower/borrower.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'create-fsp-category', component: FspCategoryFormComponent },
    { path: 'update-fsp-category', component: FspCategoryFormComponent },
    { path: 'fsp-categories', component: FspCategoriesComponent },
    { path: 'borrowers', component: BorrowerComponent },
    // { path: 'search', component: SearchComponent },
];

import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { HttpClient } from '@angular/common/http';
import { FspService } from '../../../services/fsp.service';
import { TableModule } from 'primeng/table';
import { FspCategoryDto } from '../../../dtos/fsp-category.dto';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fsp-categories',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './fsp-categories.component.html',
  styleUrl: './fsp-categories.component.css'
})
export class FspCategoriesComponent implements OnInit{
  editing: Boolean = false;
  categories: FspCategoryDto[];
  clonedCategories: { [s: number]: FspCategoryDto } = {};

  public constructor(private http:HttpClient, private fspService: FspService, private router: Router) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.fspService.categories$.subscribe(categories => {
      this.categories = categories;
      // console.log(this.categories);
    });

    this.fspService.fetchCategories();
  }

  edit(category: FspCategoryDto) {
    this.fspService.setEditingFspCategory(category);
    this.router.navigate(['update-fsp-category']);
  }

  onRowEditSave(category: FspCategoryDto) {
    
  }

  goToCreateCategory() {
   this.router.navigate(['create-fsp-category']);
  }
}

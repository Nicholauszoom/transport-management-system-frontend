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

  public constructor(private http:HttpClient, private fspService: FspService) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.fspService.categories$.subscribe(categories => {
      this.categories = categories;
      // console.log(this.categories);
    });

    this.fspService.fetchCategories();
  }

  onRowEditInit(category: FspCategoryDto) {
    this.clonedCategories[category.id as unknown as number] = { ...category };
  }

  onRowEditSave(category: FspCategoryDto) {
    delete this.clonedCategories[category.id as unknown as number];
    // if (product.price > 0) {
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    // } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    // }
  }

  onRowEditCancel(category: FspCategoryDto, index: number) {
    this.categories[index] = this.clonedCategories[category.id as unknown as number];
    delete this.clonedCategories[category.id as unknown as number];
  }
}

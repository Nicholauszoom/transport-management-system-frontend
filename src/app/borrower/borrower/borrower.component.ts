import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { BorrowerDto } from '../../../dtos/borrower.dto';
import { BorrowerService } from '../../../services/borrower.service';

@Component({
  selector: 'app-borrower',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css'
})
export class BorrowerComponent implements OnInit {

  borrowers: BorrowerDto[];

  public constructor(private http:HttpClient, private borrowerService: BorrowerService, private router: Router) {
    this.borrowers = [];
  }

  ngOnInit(): void {
    this.borrowerService.borrowers$.subscribe(borrowers => {
      this.borrowers = borrowers;
      
    });

    this.borrowerService.fetchBorrowers();
  }

}

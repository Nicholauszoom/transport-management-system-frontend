import { Component, OnInit } from '@angular/core';
import { BorrowerDto } from '../../dtos/borrower.dto';
import { HttpClient } from '@angular/common/http';
import { BorrowerService } from '../../services/borrower.service';
import { Router } from '@angular/router';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-borrower',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css'
})
export class BorrowerComponent implements OnInit {

  editing: Boolean = false;
  borrowers: BorrowerDto[];
  clonedBorrowers: { [s: number]: BorrowerDto} = {};

  public constructor(private http:HttpClient, private borrowerService: BorrowerService, private router: Router) {
    this.borrowers = [];
  }

  ngOnInit(): void {
    this.borrowerService.borrowers$.subscribe(borrowers => {
      this.borrowers = borrowers;
      // console.log(this.borrowers);
    });

    this.borrowerService.fetchBorrowers();
  }

}

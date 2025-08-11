import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../../dtos/user.dto';
import { UserServiceService } from '../../../services/user-service.service';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  user: UserDto[] = [];
  totalRecords: number = 0; 
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser(page: number = this.currentPage, size: number = this.pageSize) {
    this.userService.fetchUsers(page, size);
    this.userService.users$.subscribe(data => {
    this.user = data;
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchUser(this.currentPage, this.pageSize);
  }
}
import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../../dtos/user.dto';
import { UserServiceService } from '../../../services/user-service.service';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MenuComponent } from '../../partials/main-layout/main-layout.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule, FormsModule, CardModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  user: UserDto[] = [];
  totalRecords: number = 0; 
  currentPage: number = 1;
  pageSize: number = 10;
  term: string = '';
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private toast: MessageService,
    private primengConfig: PrimeNGConfig // Import this for PrimeNG configuration
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.userService.inProgress$.pipe(takeUntil(this.destroy$)).subscribe((progress) => {
          this.loading = progress;
        });
    this.fetchUser();
  }

  fetchUser(page: number = this.currentPage, size: number = this.pageSize) {
    this.userService.fetchUsers(page, size);
    this.userService.users$.subscribe(data => {
    this.user = data;
    });
  }

  deleteUser(id: number): void {
  if (!id) {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'User ID is not defined' });
    return;
  }
  if (confirm('Are you sure you want to delete this user?')) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.router.navigate(['user']);
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });

      },
      error: (error) => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Failed to delete charge' });
      },
    });
  }
}
  goToCreateUser() {
    this.router.navigate(['user-add']);
  }

  editUser(user: any) {
    this.router.navigate(['/user-edit', user.id]);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchUser(this.currentPage, this.pageSize);
  }
   ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
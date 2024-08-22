// import { Component, OnInit } from '@angular/core';
// import { MenuComponent } from '../../partials/main-layout/main-layout.component';
// import { TableModule } from 'primeng/table';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputTextModule } from 'primeng/inputtext';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { FspDto } from '../../../dtos/fsp.dto';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { FspService } from '../../../services/fsp.service';

// @Component({
//   selector: 'app-fsp',
//   standalone: true,
//   imports: [MenuComponent, TableModule, DropdownModule, InputTextModule, ReactiveFormsModule, CommonModule, ButtonModule],
//   templateUrl: './fsp.component.html',
//   styleUrl: './fsp.component.css'
// })
// export class FspComponent implements OnInit {
//   editing: Boolean = false;
//   fsp: FspDto[];
//   clonedFsp: { [s: number]: FspDto } = {};

//   public constructor(private http:HttpClient, private fspService: FspService, private router: Router) {
//     this.fsp = [];
//   }

//   ngOnInit(): void {
//     this.fspService.fsp$.subscribe(fsp => {
//       this.fsp = fsp;
//       // console.log(this.categories);
//     });

//     this.fspService.fetchFsp();
//   }

//   edit(fsp: FspDto) {
//     this.fspService.setEditingFsp(fsp);
//     this.router.navigate(['update-fsp']);
//   }

//   trash(fsp: FspDto) {
//     console.log("trash"+fsp.id)
//     this.fspService.trashFsp(fsp.id);
//   }

//   goToCreateCategory() {
//    this.router.navigate(['create-fsp']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProfileComponent } from '../../profile/profile.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [PanelMenuModule, NgIf, BadgeModule, MenuModule, RippleModule, AvatarModule, MenubarModule, CardModule,OverlayPanelModule, ProfileComponent ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MenuComponent implements OnInit{
  items: MenuItem[] = [];

    constructor(private router: Router) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                command: () => {
                    // this.messageService.add({ severity: 'info', summary: 'Downloads', detail: 'Downloaded from cloud', life: 3000 });
                }
            },
            {
                label: 'Financial Service Providers',
                icon: 'pi pi-file',
                items: [
                    {
                        label: 'FSP',
                        styleClass: 'custom-submenu-item',
                        // icon: 'pi pi-plus',
                        command: () => {
                            this.router.navigate(['fsp']);
                        }
                    }
                   
                ]
            },
            {
                label: 'Product',
                icon: 'pi pi-tag',
                items: [
                    {
                        label: 'product catalogues',
                        styleClass: 'custom-submenu-item',
                        // icon: 'pi pi-cloud-download',
                        command: () => {
                            this.router.navigate(['app-product']);                        }
                    }
                ]
            },
            // {
            //     label: 'Loan',
            //     icon: 'pi pi-bookmark',
            //     items: [
            //         {
            //             label: 'calculator',
            //             styleClass: 'custom-submenu-item',
            //             // icon: 'pi pi-cloud-download',
            //             command: () => {
            //                 // this.messageService.add({ severity: 'info', summary: 'Downloads', detail: 'Downloaded from cloud', life: 3000 });
            //             }
            //         },
            //         {
            //             label: 'new loan',
            //             styleClass: 'custom-submenu-item',
            //             // icon: 'pi pi-cloud-upload',
            //             command: () => {
            //                 this.router.navigate(['loan']);
            //                 // this.messageService.add({ severity: 'info', summary: 'Shared', detail: 'Exported to cloud', life: 3000 });
            //             }
            //         },
            //         {
            //             label: 'top up loan',
            //             styleClass: 'custom-submenu-item',
            //             // icon: 'pi pi-cloud-upload',
            //             command: () => {
            //                 // this.messageService.add({ severity: 'info', summary: 'Shared', detail: 'Exported to cloud', life: 3000 });
            //             }
            //         },
                   
            //     ]
            // },
            // {
            //     label: 'Borrower',
            //     icon: 'pi pi-folder-open',
            //     items: [
            //         {
            //             label: 'borrowers',
            //             styleClass: 'custom-submenu-item',
            //             // icon: 'pi pi-cloud-download',
            //             command: () => {
            //                 this.router.navigate(['borrowers']);
            //             }
            //         },
                    
            //     ]
            // },
            {
                label: 'System Logs',
                icon: 'pi pi-folder-open',
                items: [
                    {
                        label: 'logs',
                        styleClass: 'custom-submenu-item',
                        // icon: 'pi pi-cloud-download',
                        command: () => {
                            this.router.navigate(['logs']);
                            // this.messageService.add({ severity: 'info', summary: 'Downloads', detail: 'Downloaded from cloud', life: 3000 });
                        }
                    }
                ]
            },
            // {
            //     label: 'ESS Accounts',
            //     icon: 'pi pi-book',
            //     items: [
            //         {
            //             label: 'ess accounts',
            //             styleClass: 'custom-submenu-item',
            //             // icon: 'pi pi-cloud-download',
            //             command: () => {
            //                 this.router.navigate(['accounts']);
            //                 // this.messageService.add({ severity: 'info', summary: 'Downloads', detail: 'Downloaded from cloud', life: 3000 });
            //             }
            //         }
            //     ]
            // },
            // {
            //     label: 'Sync',
            //     icon: 'pi pi-cloud',
            //     items: [
            //         {
            //             label: 'Import',
            //             icon: 'pi pi-cloud-download',
            //             command: () => {
            //                 // this.messageService.add({ severity: 'info', summary: 'Downloads', detail: 'Downloaded from cloud', life: 3000 });
            //             }
            //         },
            //         {
            //             label: 'Export',
            //             icon: 'pi pi-cloud-upload',
            //             command: () => {
            //                 // this.messageService.add({ severity: 'info', summary: 'Shared', detail: 'Exported to cloud', life: 3000 });
            //             }
            //         }
            //     ]
            // },
            // {
            //     label: 'Sign Out',
            //     icon: 'pi pi-sign-out',
            //     command: () => {
            //         // this.messageService.add({ severity: 'info', summary: 'Signed out', detail: 'User logged out', life: 3000 });
            //     }
            // }
        ];
    }
}
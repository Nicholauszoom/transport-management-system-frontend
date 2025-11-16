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
    imports: [PanelMenuModule, NgIf, BadgeModule, MenuModule, RippleModule, AvatarModule, MenubarModule, CardModule, OverlayPanelModule, ProfileComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})
export class MenuComponent implements OnInit {
    items: MenuItem[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                command: () => {
                    this.router.navigate(['dashboard']);
                }
            },
            {
                label: 'Users',
                icon: 'pi pi-users',
                command: () => {
                    this.router.navigate(['user']);
                }
            },
           
            {
                label: 'Uploads',
                icon: 'pi pi-cloud-upload',
                items: [
                    {
                       label: 'Bajaji Excel Upload',
                        icon: '',
                        command: () => {
                            this.router.navigate(['taxi-upload']);
                        }
                    },
                     {
                       label: 'Finance Excel Upload',
                        icon: '',
                        command: () => {
                            this.router.navigate(['finance-upload']);
                        }
                    }
                ]
            },
            
            {
                label: 'Bajaji',
                icon: 'pi pi-code',
                        command: () => {
                            this.router.navigate(['taxi-list']);
                        }
            },
             {
                label: 'Finance/Marejesho',
                icon: 'pi pi-code',
                        command: () => {
                            this.router.navigate(['finance-list']);
                        }
            },
             {
                label: 'Spare',
                icon: 'pi pi-code',
                        command: () => {
                            // this.router.navigate(['stock-list']);
                        }
            },
            {
                label: 'Reports',
                icon: 'pi pi-folder-open',
                command: () => {
                    this.router.navigate(['transport-report']);
                }
            },
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                command: () => {
                    // this.router.navigate(['']);
                }
            }
        ];
    }
}
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
                label: 'Products',
                icon: 'pi pi-chevron-circle-right',
                command: () => {
                    this.router.navigate(['product']);
                }
            },
            {
                label: 'Charges and Pricing',
                icon: 'pi pi-chart-pie',
                items: [
                    {
                        label: 'UploadPrice Schedule',
                        icon: '',
                        command: () => {
                            this.router.navigate(['price-schedule']);
                        }
                    },
                    {
                        label: 'Upload Client RV',
                        icon: '',
                        command: () => {
                            this.router.navigate(['client-rv']);
                        }
                    },
                    {
                        label: 'Charges',
                        icon: '',
                        command: () => {
                            this.router.navigate(['charge']);
                        }
                    }
                ]
            }

        ];
    }
}
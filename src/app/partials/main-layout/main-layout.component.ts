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
                label: 'Pricings',
                icon: 'pi pi-chart-pie',
                items: [
                    {
                        label: 'charges',
                        icon: '',
                        command: () => {
                            this.router.navigate(['charge']);
                        }
                    },
                    {
                        label: 'client rv',
                        icon: '',
                        command: () => {
                            this.router.navigate(['client-rv']);
                        }
                    },
                    {
                       label: 'price schedule',
                        icon: '',
                        command: () => {
                            this.router.navigate(['price-schedule']);
                        }
                    }
                ]
            },

            {
                label: 'Loans',
                icon: 'pi pi-code',
                items: [
                    {
                        label: 'new & refinance',
                        icon: '',
                        command: () => {
                            this.router.navigate(['loan']);
                        }
                    },
                    {
                        label: 'takeover',
                        icon: '',
                        command: () => {
                            // this.router.navigate(['charge']);
                        }
                    },
                    {
                        label: 'restructure',
                        icon: '',
                        command: () => {
                            // this.router.navigate(['charge']);
                        }
                    }
                ]
            },
             {
                label: 'Liquidations',
                icon: 'pi pi-ban',
                command: () => {
                            this.router.navigate(['loan-liquidation']);
                        }
                   
            },
            {
                label: 'Reports',
                icon: 'pi pi-folder-open',
                command: () => {
                    // this.router.navigate(['']);
                }
            },
            {
                label: 'Settings',
                icon: 'pi pi-wrench',
                command: () => {
                    // this.router.navigate(['']);
                }
            }
        ];
    }
}
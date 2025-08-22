import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProfileDto } from '../../dtos/profile.dto';
import { ProfileServiceService } from '../../services/profile-service.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, OverlayPanelModule, CommonModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: ProfileDto | null = null;
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();
  
  @ViewChild('op') overlayPanel!: OverlayPanel;

  constructor(
    private profileService: ProfileServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProfile(): void {
    this.loading = true;
    this.error = null;
    
    this.profileService.fetchProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profileData) => {
          console.log('Profile loaded:', profileData);
          this.profile = profileData;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching profile data:', error);
          this.error = 'Failed to load profile data';
          this.loading = false;
        }
      });
  }

  toggleProfileCard(event: Event): void {
    if (this.overlayPanel) {
      const target = event.currentTarget as HTMLElement;
      this.overlayPanel.toggle(event, target);
    }
  }

  logout(): void {
    if (this.overlayPanel) {
      this.overlayPanel.hide();
    }
    this.authService.logout();
  }

  retryFetch(): void {
    this.fetchProfile();
  }
}
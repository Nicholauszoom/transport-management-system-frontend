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

  // toggleProfileCard(event: Event): void {
  //   if (this.overlayPanel) {
  //     const target = event.currentTarget as HTMLElement;
  //     this.overlayPanel.toggle(event, target);
  //   }
  // }

  // logout(): void {
  //   if (this.overlayPanel) {
  //     this.overlayPanel.hide();
  //   }
  //   this.authService.logout();
  // }

  retryFetch(): void {
    this.fetchProfile();
  }

  // Add these methods to your ProfileComponent class

/**
 * Get status CSS class based on user activity
 */
getStatusClass(): string {
  // You can implement logic to determine if user is online/offline
  // For now, we'll assume online. You might check last activity, websocket connection, etc.
  return this.profile ? 'online' : 'offline';
}

/**
 * Get role-specific icon
 */
getRoleIcon(): string {
  const role = this.profile?.role?.toLowerCase();
  
  switch (role) {
    case 'admin':
    case 'administrator':
      return 'pi-shield';
    case 'manager':
      return 'pi-users';
    case 'user':
      return 'pi-user';
    case 'supervisor':
      return 'pi-eye';
    default:
      return 'pi-user';
  }
}

/**
 * Get profile image URL with fallback
 */
getProfileImage(): string {
  return 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
}

/**
 * Format date for display
 */
formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Edit profile action
 */
editProfile(): void {
  if (this.overlayPanel) {
    this.overlayPanel.hide();
  }
  // Navigate to edit profile page or open edit modal
  this.router.navigate(['/profile/edit']);
}

/**
 * Enhanced logout with confirmation
 */
logout(): void {
  if (this.overlayPanel) {
    this.overlayPanel.hide();
  }
  
  // You might want to add a confirmation dialog here
  // this.confirmationService.confirm({
  //   message: 'Are you sure you want to logout?',
  //   accept: () => {
  //     this.authService.logout();
  //   }
  // });
  
  this.authService.logout();
}

/**
 * Handle overlay panel toggle with better positioning
 */
toggleProfileCard(event: Event): void {
  if (this.overlayPanel) {
    // Add a small delay to ensure proper positioning
    setTimeout(() => {
      this.overlayPanel.toggle(event);
    }, 0);
  }
}

/**
 * Get user initials for fallback avatar
 */
getUserInitials(): string {
  if (!this.profile?.username) return '';
  
  const names = this.profile.username.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return this.profile.username.substring(0, 2).toUpperCase();
}

/**
 * Check if user has specific permission/role
 */
// hasPermission(permission: string): boolean {
//   // Implement your permission checking logic here
//   return this.profile?.permissions?.includes(permission) || false;
// }
}
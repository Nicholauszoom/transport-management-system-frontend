import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileDto } from '../../dtos/profile.dto';
import { ProfileServiceService } from '../../services/profile-service.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, OverlayPanelModule, NgIf, CommonModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: ProfileDto | null = null;
  // @ViewChild('op') overlayPanel!: OverlayPanel;


  @ViewChild('op') overlayPanel!: OverlayPanel ;

  constructor(private profileService: ProfileServiceService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.fetchProfile().subscribe({
      next: (profileData) => {
        this.profile = profileData;
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
      }
    });
  }

  toggleProfileCard(event: Event): void {
    this.overlayPanel?.toggle(event);
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.overlayPanel.hide(); // Close the overlay panel
        this.router.navigate(['/login']); // Navigate to login page
      },
      (error) => {
        console.error('Error during logout', error);
        this.router.navigate(['/login']); // Navigate to login even if logout fails
      }
    );
  }
}

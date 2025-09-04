import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuComponent } from '../partials/main-layout/main-layout.component';

// Interface for activity items
export interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  icon: string;
  message: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'danger';
}

// Interface for dashboard metrics
export interface DashboardMetrics {
  totalUsers: number;
  totalMandates: number;
  successfulMandates: number;
  failedMandates: number;
  processingMandates: number;
  pendingMandates: number;
  monthlyRevenue: number;
  averageProcessingTime: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    CardModule,
    ButtonModule,
    ProgressBarModule
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Loading state
  isLoading = false;
  
  // Mock data - replace with actual service calls
  totalUsers = 1247;
  totalProducts = 3456; // This represents total mandates
  totalLoans = 2891; // This represents successful mandates
  
  // Additional metrics
  private metrics: DashboardMetrics = {
    totalUsers: 1247,
    totalMandates: 3456,
    successfulMandates: 2891,
    failedMandates: 234,
    processingMandates: 156,
    pendingMandates: 175,
    monthlyRevenue: 2847500,
    averageProcessingTime: 2.4
  };

  // Recent activities mock data
  private recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'success',
      icon: 'pi pi-check',
      message: 'Mandate #M2024-001 successfully processed',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'success'
    },
    {
      id: '2',
      type: 'warning',
      icon: 'pi pi-exclamation-triangle',
      message: 'Mandate #M2024-002 requires additional verification',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'warning'
    },
    {
      id: '3',
      type: 'info',
      icon: 'pi pi-info-circle',
      message: 'New user registration: John Doe',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'success'
    },
    {
      id: '4',
      type: 'danger',
      icon: 'pi pi-times',
      message: 'Mandate #M2024-003 processing failed',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'danger'
    },
    {
      id: '5',
      type: 'success',
      icon: 'pi pi-check',
      message: 'Monthly report generated successfully',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      status: 'success'
    }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load dashboard data from services
   */
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // In real implementation, call your services here
      // this.dashboardService.getMetrics().subscribe(...)
      this.isLoading = false;
      
      this.showWelcomeMessage();
    }, 1500);
  }

  /**
   * Start real-time updates for dashboard metrics
   */
  private startRealTimeUpdates(): void {
    // Update metrics every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMetrics();
      });
  }

  /**
   * Update metrics with simulated real-time data
   */
  private updateMetrics(): void {
    // Simulate small changes in metrics
    const variations = {
      users: Math.floor(Math.random() * 10) - 5,
      mandates: Math.floor(Math.random() * 20) - 10,
      success: Math.floor(Math.random() * 15) - 7
    };

    this.totalUsers += variations.users;
    this.totalProducts += variations.mandates;
    this.totalLoans += variations.success;

    // Ensure no negative values
    this.totalUsers = Math.max(0, this.totalUsers);
    this.totalProducts = Math.max(0, this.totalProducts);
    this.totalLoans = Math.max(0, this.totalLoans);
  }

  /**
   * Show welcome message on dashboard load
   */
  private showWelcomeMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Dashboard Loaded',
      detail: 'Welcome back! Your dashboard has been updated with the latest data.',
      life: 3000
    });
  }

  /**
   * Calculate success rate percentage
   */
  getSuccessRate(): number {
    if (this.totalProducts === 0) return 0;
    return Math.round((this.totalLoans / this.totalProducts) * 100);
  }

  /**
   * Get total value of all mandates
   */
  getTotalValue(): number {
    return this.metrics.monthlyRevenue * 2.3; // Simulate total value
  }

  /**
   * Get count of active mandates this month
   */
  getActiveCount(): number {
    return this.metrics.processingMandates + this.metrics.pendingMandates;
  }

  /**
   * Get failed mandates count
   */
  getFailedCount(): number {
    return this.metrics.failedMandates;
  }

  /**
   * Get pending review count
   */
  getPendingReviewCount(): number {
    return Math.floor(this.metrics.failedMandates * 0.3); // 30% of failed need review
  }

  /**
   * Get processing count
   */
  getProcessingCount(): number {
    return this.metrics.processingMandates;
  }

  /**
   * Get pending count
   */
  getPendingCount(): number {
    return this.metrics.pendingMandates;
  }

  /**
   * Get monthly revenue
   */
  getMonthlyRevenue(): number {
    return this.metrics.monthlyRevenue;
  }

  /**
   * Get average processing time
   */
  getAverageProcessingTime(): string {
    return `${this.metrics.averageProcessingTime}h`;
  }

  /**
   * Get recent activities
   */
  getRecentActivities(): ActivityItem[] {
    return this.recentActivities.slice(0, 5); // Return only latest 5
  }

  /**
   * Get status icon based on activity status
   */
  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      success: 'pi pi-check',
      warning: 'pi pi-exclamation-triangle',
      danger: 'pi pi-times'
    };
    return iconMap[status] || 'pi pi-info-circle';
  }

  // Navigation methods
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToMandates(): void {
    this.router.navigate(['/mandate-list']);
  }

  navigateToSuccess(): void {
    this.router.navigate(['/mandate-list'], { 
      queryParams: { status: 'success' } 
    });
  }

  navigateToFailed(): void {
    this.router.navigate(['/mandate-list'], { 
      queryParams: { status: 'failed' } 
    });
  }

  // Action methods
  refreshData(): void {
    this.isLoading = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing',
      detail: 'Updating dashboard data...'
    });

    setTimeout(() => {
      this.loadDashboardData();
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Dashboard data has been refreshed'
      });
    }, 2000);
  }

  exportReport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Exporting',
      detail: 'Generating dashboard report...'
    });

    // Simulate export process
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Export Complete',
        detail: 'Dashboard report has been downloaded'
      });
    }, 3000);
  }

  createNewMandate(): void {
    this.router.navigate(['/mandate/create']);
  }

  bulkExport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Bulk Export',
      detail: 'Starting bulk export process...'
    });

    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Export Ready',
        detail: 'Bulk export file is ready for download'
      });
    }, 5000);
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }

  openHelp(): void {
    // Open help modal or navigate to help page
    this.messageService.add({
      severity: 'info',
      summary: 'Help & Support',
      detail: 'Opening help documentation...'
    });
  }

  viewAllActivity(): void {
    this.router.navigate(['/activity-log']);
  }

  /**
   * Handle real-time notifications
   */
  private handleNotification(notification: any): void {
    this.messageService.add({
      severity: notification.type,
      summary: notification.title,
      detail: notification.message,
      life: 5000
    });

    // Add to recent activities
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: notification.type,
      icon: notification.icon || 'pi pi-bell',
      message: notification.message,
      timestamp: new Date(),
      status: notification.type
    };

    this.recentActivities.unshift(newActivity);
    // Keep only latest 10 activities
    if (this.recentActivities.length > 10) {
      this.recentActivities = this.recentActivities.slice(0, 10);
    }
  }

  /**
   * Simulate real-time notifications
   */
  private simulateNotifications(): void {
    const notifications = [
      {
        type: 'success',
        title: 'Mandate Approved',
        message: 'Mandate #M2024-0156 has been approved',
        icon: 'pi pi-check'
      },
      {
        type: 'warning',
        title: 'Review Required',
        message: 'Mandate #M2024-0157 requires manual review',
        icon: 'pi pi-exclamation-triangle'
      },
      {
        type: 'info',
        title: 'System Update',
        message: 'System maintenance scheduled for tonight',
        icon: 'pi pi-info-circle'
      }
    ];

    // Randomly show notifications
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.handleNotification(randomNotification);
      }
    }, 45000); // Every 45 seconds
  }

  /**
   * Format large numbers for display
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Get trend indicator
   */
  getTrendIndicator(current: number, previous: number): { direction: 'up' | 'down', percentage: number } {
    const diff = current - previous;
    const percentage = Math.abs((diff / previous) * 100);
    
    return {
      direction: diff >= 0 ? 'up' : 'down',
      percentage: Math.round(percentage * 10) / 10
    };
  }

  /**
   * Initialize real-time features
   */
  private initializeRealTimeFeatures(): void {
    // Start simulating notifications after component loads
    setTimeout(() => {
      this.simulateNotifications();
    }, 5000);
  }
}
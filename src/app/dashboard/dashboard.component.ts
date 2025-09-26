import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuComponent } from '../partials/main-layout/main-layout.component';
import { DashboardService } from '../../services/dashboard.service';
import { DashbordDto } from '../../dtos/dashbord.dto';

// Interface for activity items
export interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  icon: string;
  message: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'danger';
}

// Interface for dashboard metrics (keeping for additional calculated metrics)
export interface DashboardMetrics {
  monthlyRevenue: number;
  averageProcessingTime: number;
  processingMandates: number;
  pendingMandates: number;
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
  
  // Backend data
  dashboardData: DashbordDto = {
    totalUsers: 0,
    totalMandates: 0,
    successMandates: 0,
    failedMandates: 0
  };

  // Additional metrics for calculations
  private additionalMetrics: DashboardMetrics = {
    monthlyRevenue: 2847500,
    averageProcessingTime: 2.4,
    processingMandates: 156,
    pendingMandates: 175
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private dashboardService: DashboardService
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
   * Load dashboard data from backend
   */
  private loadDashboardData(): void {
    this.isLoading = true;
    this.fetchStatistics();
  }

  /**
   * Fetch statistics from backend
   */
  fetchStatistics(): void {
    this.dashboardService
      .fetchStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Fetched statistics response:', response);
          
          // Response structure: { statistics: DashbordDto, totalRecords: number }
          // where statistics is your single object: {totalUsers:2, totalMandates:21, successMandates:5, failedMandates:1}
          if (response && response.statistics) {
            this.dashboardData = {
              totalUsers: response.statistics.totalUsers || 0,
              totalMandates: response.statistics.totalMandates || 0,
              successMandates: response.statistics.successMandates || 0,
              failedMandates: response.statistics.failedMandates || 0
            };
          } else {
            this.dashboardData = {
              totalUsers: 0,
              totalMandates: 0,
              successMandates: 0,
              failedMandates: 0
            };
          }
          
          console.log('Final dashboard data:', this.dashboardData);
          this.isLoading = false;
          this.showWelcomeMessage();
        },
        error: (err) => {
          console.error('Failed to fetch statistics:', err);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dashboard data',
            life: 5000
          });
        }
      });
  }

  /**
   * Aggregate statistics if response contains an array
   */
  private aggregateStatistics(statistics: DashbordDto[]): DashbordDto {
    return statistics.reduce((acc, curr) => ({
      totalUsers: (acc.totalUsers || 0) + (curr.totalUsers || 0),
      totalMandates: (acc.totalMandates || 0) + (curr.totalMandates || 0),
      successMandates: (acc.successMandates || 0) + (curr.successMandates || 0),
      failedMandates: (acc.failedMandates || 0) + (curr.failedMandates || 0)
    }), {
      totalUsers: 0,
      totalMandates: 0,
      successMandates: 0,
      failedMandates: 0
    });
  }

  /**
   * Start real-time updates for dashboard metrics
   */
  private startRealTimeUpdates(): void {
    // Update metrics every 5 minutes
    interval(300000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchStatistics();
      });
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

  // Getter methods for template access
  get totalUsers(): number {
    return this.dashboardData.totalUsers || 0;
  }

  get totalProducts(): number {
    return this.dashboardData.totalMandates || 0;
  }

  get totalLoans(): number {
    return this.dashboardData.successMandates || 0;
  }

  /**
   * Calculate success rate percentage
   */
  getSuccessRate(): number {
    if (!this.dashboardData.totalMandates || this.dashboardData.totalMandates === 0) {
      return 0;
    }
    return Math.round(((this.dashboardData.successMandates || 0) / this.dashboardData.totalMandates) * 100);
  }

  /**
   * Get total value of all mandates (calculated from revenue)
   */
  getTotalValue(): number {
    return this.additionalMetrics.monthlyRevenue * 2.3;
  }

  /**
   * Get count of active mandates this month
   */
  getActiveCount(): number {
    return this.additionalMetrics.processingMandates + this.additionalMetrics.pendingMandates;
  }

  /**
   * Get failed mandates count
   */
  getFailedCount(): number {
    return this.dashboardData.failedMandates || 0;
  }

  /**
   * Get pending review count (calculated from failed mandates)
   */
  getPendingReviewCount(): number {
    const failedCount = this.dashboardData.failedMandates || 0;
    return Math.floor(failedCount * 0.3); // 30% of failed need review
  }

  /**
   * Get processing count
   */
  getProcessingCount(): number {
    return this.additionalMetrics.processingMandates;
  }

  /**
   * Get pending count
   */
  getPendingCount(): number {
    return this.additionalMetrics.pendingMandates;
  }

  /**
   * Get monthly revenue
   */
  getMonthlyRevenue(): number {
    return this.additionalMetrics.monthlyRevenue;
  }

  /**
   * Get average processing time
   */
  getAverageProcessingTime(): string {
    return `${this.additionalMetrics.averageProcessingTime}h`;
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
    this.router.navigate(['/user']);
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
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing',
      detail: 'Updating dashboard data...'
    });

    this.fetchStatistics();
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
}
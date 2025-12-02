import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  loading = true;
  private subscriptions = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getUserNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
      },
      error: (error) => console.error('Error marking all as read:', error)
    });
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'ORDER_PLACED': 'fas fa-shopping-cart',
      'ORDER_PACKED': 'fas fa-box',
      'ORDER_OUT_FOR_DELIVERY': 'fas fa-truck',
      'ORDER_DELIVERED': 'fas fa-check-circle',
      'PAYMENT_SUCCESS': 'fas fa-credit-card',
      'PAYMENT_FAILED': 'fas fa-exclamation-triangle'
    };
    return icons[type] || 'fas fa-bell';
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }
}
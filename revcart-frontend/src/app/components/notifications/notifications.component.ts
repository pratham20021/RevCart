import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount = 0;
  showDropdown = false;
  private subscriptions = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
    
    // Subscribe to real-time notifications
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.updateUnreadCount();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadNotifications() {
    this.notificationService.getUserNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => console.error('Error loading notifications:', error)
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCount = response.unreadCount;
      },
      error: (error) => console.error('Error loading unread count:', error)
    });
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.updateUnreadCount();
        }
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}
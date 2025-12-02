import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats } from '../../../services/admin.service';
import { OrderService, RecentOrder } from '../../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  totalProducts = 0;
  totalOrders = 0;
  totalUsers = 0;
  totalRevenue = 0;
  loading = true;
  
  recentOrders: RecentOrder[] = [];
  
  constructor(
    private adminService: AdminService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadRecentOrders();
  }
  
  loadDashboardData() {
    this.adminService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.totalProducts = stats.totalProducts;
        this.totalOrders = stats.totalOrders;
        this.totalUsers = stats.totalUsers;
        this.totalRevenue = stats.totalRevenue;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
        // Fallback to mock data
        this.totalProducts = 22;
        this.totalOrders = 156;
        this.totalUsers = 89;
        this.totalRevenue = 45680;
      }
    });
  }

  loadRecentOrders() {
    this.adminService.getRecentOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5); // Show only 5 recent orders
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
        // Fallback to mock data
        this.recentOrders = [
          {
            orderId: '#RC001234',
            customerName: 'John Doe',
            amount: 450,
            status: 'PROCESSING',
            createdAt: new Date().toISOString()
          },
          {
            orderId: '#RC001235',
            customerName: 'Jane Smith',
            amount: 320,
            status: 'DELIVERED',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
      }
    });
  }
  
  exportData() {
    // Implement data export functionality
    alert('Export functionality will be implemented soon!');
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT';
  status: 'active' | 'inactive' | 'blocked';
  joinDate: Date;
  lastLogin: Date;
  totalOrders: number;
  totalSpent: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1 class="admin-title">
          <i class="fas fa-users"></i>
          User <span class="neon-text">Management</span>
        </h1>
        <div class="filter-buttons">
          <button 
            class="filter-btn"
            [class.active]="selectedRole === 'all'"
            (click)="filterByRole('all')">
            All Users
          </button>
          <button 
            class="filter-btn"
            [class.active]="selectedRole === 'CUSTOMER'"
            (click)="filterByRole('CUSTOMER')">
            Customers
          </button>
          <button 
            class="filter-btn"
            [class.active]="selectedRole === 'DELIVERY_AGENT'"
            (click)="filterByRole('DELIVERY_AGENT')">
            Delivery Agents
          </button>
          <button 
            class="filter-btn"
            [class.active]="selectedRole === 'ADMIN'"
            (click)="filterByRole('ADMIN')">
            Admins
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table glass-card">
        <div class="table-header">
          <h3>Users ({{filteredUsers.length}})</h3>
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Search users..."
              [(ngModel)]="searchQuery"
              (input)="filterUsers()"
              class="search-input">
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                      <h4>{{user.name}}</h4>
                      <p>{{user.email}}</p>
                      <p>{{user.phone}}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [ngClass]="user.role.toLowerCase()">
                    {{getRoleName(user.role)}}
                  </span>
                </td>
                <td>
                  <select 
                    class="status-select"
                    [value]="user.status"
                    (change)="updateUserStatus(user, $event)">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </td>
                <td>
                  <span class="orders-count">{{user.totalOrders}}</span>
                </td>
                <td>
                  <span class="total-spent">₹{{user.totalSpent}}</span>
                </td>
                <td>
                  <span class="join-date">{{user.joinDate | date:'short'}}</span>
                </td>
                <td>
                  <span class="last-login">{{user.lastLogin | date:'short'}}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon view" (click)="viewUser(user)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit" (click)="editUser(user)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" (click)="deleteUser(user.id)" *ngIf="user.role !== 'ADMIN'">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      padding: 120px 20px 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .admin-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-white);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .filter-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 10px 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: transparent;
      color: var(--text-white);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
      font-weight: 500;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: var(--neon-blue);
      border-color: var(--neon-blue);
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
    }

    .users-table {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .table-header {
      padding: 25px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      color: var(--text-white);
      font-size: 1.3rem;
      font-weight: 600;
    }

    .search-input {
      padding: 10px 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--border-radius);
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-white);
      width: 250px;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    th, td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    th {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-white);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-avatar {
      width: 50px;
      height: 50px;
      background: var(--primary-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
    }

    .user-details h4 {
      color: var(--text-white);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .user-details p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    .role-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-badge.customer {
      background: rgba(40, 167, 69, 0.2);
      color: #28a745;
    }

    .role-badge.admin {
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
    }

    .role-badge.delivery_agent {
      background: rgba(0, 123, 255, 0.2);
      color: #007bff;
    }

    .status-select {
      padding: 6px 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--border-radius);
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-white);
      font-size: 0.9rem;
    }

    .orders-count {
      background: var(--primary-gradient);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .total-spent {
      color: var(--neon-green);
      font-weight: 700;
      font-size: 1rem;
    }

    .join-date, .last-login {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-icon.view {
      background: rgba(0, 212, 255, 0.2);
      color: var(--neon-blue);
    }

    .btn-icon.edit {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .btn-icon.delete {
      background: rgba(255, 71, 87, 0.2);
      color: #ff4757;
    }

    .btn-icon:hover {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .admin-title {
        font-size: 2rem;
        justify-content: center;
      }
      
      .filter-buttons {
        justify-content: center;
      }
      
      .table-header {
        flex-direction: column;
        gap: 15px;
      }
      
      .search-input {
        width: 100%;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  selectedRole = 'all';
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    // Mock users data
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        role: 'CUSTOMER',
        status: 'active',
        joinDate: new Date('2023-06-15'),
        lastLogin: new Date('2024-01-15T10:30:00'),
        totalOrders: 25,
        totalSpent: 12500
      },
      {
        id: 2,
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '+91 9876543211',
        role: 'ADMIN',
        status: 'active',
        joinDate: new Date('2023-01-01'),
        lastLogin: new Date('2024-01-15T11:00:00'),
        totalOrders: 0,
        totalSpent: 0
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+91 9876543212',
        role: 'CUSTOMER',
        status: 'active',
        joinDate: new Date('2023-08-20'),
        lastLogin: new Date('2024-01-14T16:45:00'),
        totalOrders: 18,
        totalSpent: 8900
      },
      {
        id: 4,
        name: 'Mike Delivery',
        email: 'delivery@demo.com',
        phone: '+91 9876543213',
        role: 'DELIVERY_AGENT',
        status: 'active',
        joinDate: new Date('2023-03-10'),
        lastLogin: new Date('2024-01-15T09:15:00'),
        totalOrders: 0,
        totalSpent: 0
      },
      {
        id: 5,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+91 9876543214',
        role: 'CUSTOMER',
        status: 'inactive',
        joinDate: new Date('2023-11-05'),
        lastLogin: new Date('2024-01-10T14:20:00'),
        totalOrders: 5,
        totalSpent: 2300
      }
    ];
    
    this.filteredUsers = this.users;
  }
  
  filterUsers() {
    let filtered = this.users;
    
    // Filter by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.phone.includes(this.searchQuery)
      );
    }
    
    this.filteredUsers = filtered;
  }
  
  filterByRole(role: string) {
    this.selectedRole = role;
    this.filterUsers();
  }
  
  updateUserStatus(user: User, event: any) {
    const newStatus = event.target.value;
    user.status = newStatus;
    alert(`User ${user.name} status updated to ${newStatus}`);
  }
  
  viewUser(user: User) {
    alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
  }
  
  editUser(user: User) {
    alert(`Edit user functionality for ${user.name} will be implemented soon!`);
  }
  
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
      this.filterUsers();
      alert('User deleted successfully!');
    }
  }
  
  getRoleName(role: string): string {
    switch (role) {
      case 'CUSTOMER': return 'Customer';
      case 'ADMIN': return 'Admin';
      case 'DELIVERY_AGENT': return 'Delivery Agent';
      default: return role;
    }
  }
}
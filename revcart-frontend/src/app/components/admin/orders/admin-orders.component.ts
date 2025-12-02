import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../services/checkout.service';
import { OrderService, RecentOrder } from '../../../services/order.service';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  itemCount: number;
  amount: number;
  paymentMethod: 'card' | 'upi' | 'cod';
  paymentStatus: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  address: string;
  items: any[];
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  recentOrders: RecentOrder[] = [];
  searchQuery = '';
  selectedStatus = 'all';
  showModal = false;
  selectedOrder: Order | null = null;
  
  constructor(
    private checkoutService: CheckoutService,
    private orderService: OrderService
  ) {}
  
  ngOnInit() {
    this.loadOrders();
    this.loadRecentOrders();
  }
  
  loadOrders() {
    this.checkoutService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          id: order.id.toString(),
          customerName: order.user?.name || 'Customer',
          email: order.user?.email || 'N/A',
          phone: order.user?.phone || 'N/A',
          itemCount: 0,
          amount: order.totalAmount,
          paymentMethod: 'card' as any,
          paymentStatus: order.paymentStatus,
          status: order.orderStatus.toLowerCase() as any,
          date: new Date(order.createdAt),
          address: 'N/A',
          items: []
        }));
        this.filteredOrders = this.orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loadMockOrders();
      }
    });
  }
  
  loadMockOrders() {
    // Mock orders data
    this.orders = [
      {
        id: 'RC001234',
        customerName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        itemCount: 5,
        amount: 450,
        paymentMethod: 'card',
        paymentStatus: 'Paid',
        status: 'processing',
        date: new Date('2024-01-15T10:30:00'),
        address: '123 Main St, Mumbai, Maharashtra 400001',
        items: [
          { name: 'Organic Bananas', quantity: 2, price: 45, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop' },
          { name: 'Fresh Apples', quantity: 1, price: 120, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop' },
          { name: 'Premium Milk', quantity: 2, price: 65, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop' }
        ]
      },
      {
        id: 'RC001235',
        customerName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+91 9876543211',
        itemCount: 3,
        amount: 320,
        paymentMethod: 'upi',
        paymentStatus: 'Paid',
        status: 'delivered',
        date: new Date('2024-01-15T09:15:00'),
        address: '456 Park Ave, Delhi, Delhi 110001',
        items: [
          { name: 'Greek Yogurt', quantity: 2, price: 85, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop' },
          { name: 'Whole Wheat Bread', quantity: 1, price: 40, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop' }
        ]
      },
      {
        id: 'RC001236',
        customerName: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+91 9876543212',
        itemCount: 8,
        amount: 680,
        paymentMethod: 'cod',
        paymentStatus: 'Pending',
        status: 'pending',
        date: new Date('2024-01-15T08:45:00'),
        address: '789 Oak St, Bangalore, Karnataka 560001',
        items: [
          { name: 'Fresh Salmon', quantity: 1, price: 450, imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop' },
          { name: 'Chicken Breast', quantity: 1, price: 250, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop' }
        ]
      },
      {
        id: 'RC001237',
        customerName: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+91 9876543213',
        itemCount: 4,
        amount: 290,
        paymentMethod: 'card',
        paymentStatus: 'Paid',
        status: 'shipped',
        date: new Date('2024-01-14T16:20:00'),
        address: '321 Pine St, Chennai, Tamil Nadu 600001',
        items: [
          { name: 'Orange Juice', quantity: 2, price: 90, imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop' },
          { name: 'Farm Eggs', quantity: 1, price: 80, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop' }
        ]
      },
      {
        id: 'RC001238',
        customerName: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+91 9876543214',
        itemCount: 6,
        amount: 520,
        paymentMethod: 'upi',
        paymentStatus: 'Refunded',
        status: 'cancelled',
        date: new Date('2024-01-14T14:10:00'),
        address: '654 Elm St, Pune, Maharashtra 411001',
        items: [
          { name: 'Fresh Prawns', quantity: 1, price: 380, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&h=300&fit=crop' },
          { name: 'Cheddar Cheese', quantity: 1, price: 200, imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop' }
        ]
      }
    ];
    
    this.filteredOrders = this.orders;
  }

  loadRecentOrders() {
    this.orderService.getRecentOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders;
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
  
  filterOrders() {
    let filtered = this.orders;
    
    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    this.filteredOrders = filtered;
  }
  
  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.filterOrders();
  }
  
  updateOrderStatus(order: Order, event: any) {
    const newStatus = event.target.value;
    order.status = newStatus;
    
    // Update payment status based on order status
    if (newStatus === 'delivered') {
      order.paymentStatus = 'Paid';
    } else if (newStatus === 'cancelled') {
      order.paymentStatus = 'Refunded';
    }
    
    alert(`Order #${order.id} status updated to ${newStatus}`);
  }
  
  viewOrder(order: Order) {
    this.selectedOrder = order;
    this.showModal = true;
  }
  
  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orders = this.orders.filter(order => order.id !== orderId);
      this.filterOrders();
      alert('Order deleted successfully!');
    }
  }
  
  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }
  
  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI Payment';
      case 'cod': return 'Cash on Delivery';
      default: return method;
    }
  }
}
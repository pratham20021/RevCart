import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  
  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      return;
    }
    
    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login failed:', error);
      }
    });
  }
  
  createTestNotifications() {
    this.http.post('http://localhost:8080/api/notifications/test', {}).subscribe({
      next: (response) => {
        alert('Test notifications created! Check the bell icon.');
      },
      error: (error) => {
        console.error('Error creating test notifications:', error);
        alert('Please login first to create test notifications.');
      }
    });
  }
}
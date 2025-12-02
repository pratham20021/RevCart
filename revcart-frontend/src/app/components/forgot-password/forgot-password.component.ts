import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>
        
        <!-- Step 1: Enter Email -->
        <div *ngIf="step === 1" class="mt-8 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" [(ngModel)]="email" 
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                   placeholder="Enter your email">
          </div>
          <button (click)="sendOTP()" [disabled]="loading"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            {{loading ? 'Sending...' : 'Send OTP'}}
          </button>
        </div>

        <!-- Step 2: Enter OTP and New Password -->
        <div *ngIf="step === 2" class="mt-8 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">OTP</label>
            <input type="text" [(ngModel)]="otp" 
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                   placeholder="Enter 6-digit OTP">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" [(ngModel)]="newPassword" 
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                   placeholder="Enter new password">
          </div>
          <button (click)="resetPassword()" [disabled]="loading"
                  class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
            {{loading ? 'Resetting...' : 'Reset Password'}}
          </button>
        </div>

        <div class="text-center">
          <a routerLink="/login" class="text-blue-600 hover:text-blue-500">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  otp = '';
  newPassword = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  sendOTP() {
    if (!this.email) return;
    
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.step = 2;
        alert('OTP sent successfully!');
      },
      error: (error) => {
        this.loading = false;
        alert('Error sending OTP: ' + error.error);
      }
    });
  }

  resetPassword() {
    if (!this.otp || !this.newPassword) return;
    
    this.loading = true;
    this.authService.resetPassword(this.email, this.otp, this.newPassword).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Password reset successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        alert('Error resetting password: ' + error.error);
      }
    });
  }
}
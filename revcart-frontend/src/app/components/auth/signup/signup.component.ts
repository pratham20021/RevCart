import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData: SignupRequest = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  };
  
  loading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSignup() {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Signup data:', this.signupData);
    this.loading = true;
    
    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.loading = false;
        if (error.error && typeof error.error === 'string') {
          alert('Signup failed: ' + error.error);
        } else {
          alert('Signup failed. Please try again.');
        }
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="oauth2-redirect">
      <div class="loading-spinner"></div>
      <p>Processing authentication...</p>
    </div>
  `,
  styles: [`
    .oauth2-redirect {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class OAuth2RedirectComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        // Decode JWT to get user info
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const user = {
            id: 0,
            name: '',
            email: payload.sub,
            role: 'CUSTOMER' as const
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.authService['currentUserSubject'].next(user);
        } catch (e) {
          console.error('Error parsing token:', e);
        }
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
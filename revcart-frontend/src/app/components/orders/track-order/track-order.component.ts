import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="track-container">
      <div class="container">
        <div class="track-header">
          <h1>Track Your Order</h1>
          <p>Order ID: {{orderId}}</p>
        </div>
        
        <div class="order-progress">
          <div class="progress-step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <div class="step-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="step-info">
              <h3>Order Placed</h3>
              <p>{{orderPlacedTime | date:'medium'}}</p>
            </div>
          </div>
          
          <div class="progress-line" [class.active]="currentStep >= 2"></div>
          
          <div class="progress-step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <div class="step-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="step-info">
              <h3>Order Packed</h3>
              <p *ngIf="currentStep >= 2">{{getStepTime(2) | date:'medium'}}</p>
            </div>
          </div>
          
          <div class="progress-line" [class.active]="currentStep >= 3"></div>
          
          <div class="progress-step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
            <div class="step-icon">
              <i class="fas fa-truck"></i>
            </div>
            <div class="step-info">
              <h3>Out for Delivery</h3>
              <p *ngIf="currentStep >= 3">{{getStepTime(3) | date:'medium'}}</p>
            </div>
          </div>
          
          <div class="progress-line" [class.active]="currentStep >= 4"></div>
          
          <div class="progress-step" [class.active]="currentStep >= 4">
            <div class="step-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="step-info">
              <h3>Delivered</h3>
              <p *ngIf="currentStep >= 4">{{getStepTime(4) | date:'medium'}}</p>
            </div>
          </div>
        </div>
        
        <div class="estimated-time" *ngIf="currentStep < 4">
          <p>Estimated delivery: {{estimatedDelivery | date:'medium'}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .track-container {
      min-height: 100vh;
      padding: 120px 20px 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }
    .track-header {
      text-align: center;
      margin-bottom: 60px;
      color: white;
    }
    .order-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: #ccc;
    }
    .progress-step.active {
      color: #00d4ff;
    }
    .step-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #444;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 15px;
    }
    .progress-step.active .step-icon {
      background: #00d4ff;
      color: white;
    }
    .progress-line {
      width: 100px;
      height: 3px;
      background: #444;
      margin: 0 20px;
    }
    .progress-line.active {
      background: #00d4ff;
    }
    .estimated-time {
      text-align: center;
      margin-top: 40px;
      color: white;
    }
  `]
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  orderId: string = '';
  currentStep: number = 1;
  orderPlacedTime: Date = new Date();
  estimatedDelivery: Date = new Date();
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'] || 'RC' + Date.now();
    });

    this.orderPlacedTime = new Date();
    this.estimatedDelivery = new Date(Date.now() + 4 * 60 * 1000);

    this.subscription = interval(60000).subscribe(() => {
      this.updateOrderStatus();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateOrderStatus() {
    const elapsed = Date.now() - this.orderPlacedTime.getTime();
    const minutes = elapsed / (1000 * 60);

    if (minutes >= 4) {
      this.currentStep = 4;
    } else if (minutes >= 3) {
      this.currentStep = 3;
    } else if (minutes >= 1) {
      this.currentStep = 2;
    }
  }

  getStepTime(step: number): Date {
    const baseTime = this.orderPlacedTime.getTime();
    switch (step) {
      case 2: return new Date(baseTime + 1 * 60 * 1000);
      case 3: return new Date(baseTime + 3 * 60 * 1000);
      case 4: return new Date(baseTime + 4 * 60 * 1000);
      default: return this.orderPlacedTime;
    }
  }
}
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/products/admin-products.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';
import { AdminOrdersComponent } from './components/admin/orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin/users/admin-users.component';
import { AdminGuard } from './guards/admin.guard';
import { OAuth2RedirectComponent } from './components/auth/oauth2-redirect/oauth2-redirect.component';
import { TrackOrderComponent } from './components/orders/track-order/track-order.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotificationsPageComponent } from './components/notifications-page/notifications-page.component';
import { CouponsComponent } from './components/coupons/coupons.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'order-success',
    component: OrderSuccessComponent
  },
  {
    path: 'oauth2/redirect',
    component: OAuth2RedirectComponent
  },
  {
    path: 'track-order/:id',
    component: TrackOrderComponent
  },
  {
    path: 'notifications',
    component: NotificationsPageComponent
  },
  {
    path: 'coupons',
    component: CouponsComponent
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'products',
        component: AdminProductsComponent
      },
      {
        path: 'products/add',
        component: AddProductComponent
      },
      {
        path: 'products/edit/:id',
        component: EditProductComponent
      },
      {
        path: 'orders',
        component: AdminOrdersComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
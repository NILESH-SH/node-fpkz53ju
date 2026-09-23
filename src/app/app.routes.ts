import { Routes } from '@angular/router';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { CartComponent } from './pages/cart/cart.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: MarketplaceComponent },
  { path: 'cart', component: CartComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
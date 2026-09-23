import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarbonCredit, Role } from '../../models/models';
import { CarbonCreditService } from '../../services/carbon-credit.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent {
  search = '';
  category = 'All';
  quantity: Record<number, number> = {};
  message = '';
  authMode: 'login' | 'register' = 'login';

  loginEmail = '';
  loginPassword = '';
  authError = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerRole: Role = 'buyer';

  categories = [
    'All', 'Solar Energy', 'Wind Energy', 'Reforestation',
    'Hydroelectric', 'Biomass', 'Waste Management'
  ];

  credits: CarbonCredit[] = [];

  constructor(
    public auth: AuthService,
    private service: CarbonCreditService,
    private cart: CartService
  ) {
    this.filter();
  }

  filter(): void {
    const search = this.search.toLowerCase();
    this.credits = this.service.getAll().filter(c =>
      c.projectName.toLowerCase().includes(search) &&
      (this.category === 'All' || c.category === this.category)
    );
  }

  add(credit: CarbonCredit): void {
    const qty = this.quantity[credit.id] || 1;
    if (qty < 1 || qty > credit.availableCredits) {
      this.message = 'Please enter a valid available quantity.';
      return;
    }

    if (this.cart.add(credit, qty)) {
      this.message = `${qty} credit(s) added to cart.`;
    } else {
      this.message = 'You cannot add more than the available credits.';
    }
  }

  login(): void {
    this.authError = this.auth.login(this.loginEmail, this.loginPassword)
      ? ''
      : 'Invalid email or password.';
    if (!this.authError) this.message = 'Login successful.';
  }

  register(): void {
    if (!this.registerName || !this.registerEmail || this.registerPassword.length < 6) {
      this.authError = 'Enter all fields. Password must be at least 6 characters.';
      return;
    }

    const success = this.auth.register(
      this.registerName,
      this.registerEmail,
      this.registerPassword,
      this.registerRole
    );

    this.authError = success
      ? 'Registration successful. Please login.'
      : 'An account with this email already exists.';

    if (success) this.authMode = 'login';
  }
}
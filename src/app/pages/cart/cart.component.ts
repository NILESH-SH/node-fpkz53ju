import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartItem } from '../../models/models';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CarbonCreditService } from '../../services/carbon-credit.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  items: CartItem[] = [];
  checkout = false;
  message = '';

  form = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin: ''
  };

  constructor(
    public cart: CartService,
    private auth: AuthService,
    private credits: CarbonCreditService,
    private orders: OrderService,
    private router: Router
  ) {
    this.load();
    const user = this.auth.current();
    if (user) {
      this.form.name = user.name;
      this.form.email = user.email;
    }
  }

  load(): void {
    this.items = this.cart.getItems();
  }

  change(item: CartItem, value: number): void {
    if (this.cart.setQuantity(item.credit.id, value)) this.load();
  }

  remove(id: number): void {
    this.cart.remove(id);
    this.load();
  }

  placeOrder(): void {
    if (!this.form.name || !this.form.email || !this.form.phone ||
        !this.form.address || !this.form.city || !this.form.state ||
        !/^\d{6}$/.test(this.form.pin)) {
      this.message = 'Please complete all checkout fields. PIN code must be 6 digits.';
      return;
    }

    const user = this.auth.current();
    if (!user || this.items.length === 0) return;

    this.orders.add({
      id: Date.now(),
      buyerId: user.id,
      date: new Date().toISOString(),
      items: this.items.map(i => ({
        projectName: i.credit.projectName,
        price: i.credit.price,
        quantity: i.quantity,
        subtotal: i.credit.price * i.quantity
      })),
      totalCredits: this.cart.credits(),
      totalPrice: this.cart.total()
    });

    this.items.forEach(i => this.credits.reduce(i.credit.id, i.quantity));
    this.cart.clear();
    this.load();
    this.checkout = false;
    this.message = 'Order placed successfully!';
  }
}
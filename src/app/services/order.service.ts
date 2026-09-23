import { Injectable } from '@angular/core';
import { Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private key = 'cc_orders';

  getAll(): Order[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  byBuyer(id: number): Order[] {
    return this.getAll().filter(o => o.buyerId === id);
  }

  add(order: Order): void {
    const orders = this.getAll();
    orders.push(order);
    localStorage.setItem(this.key, JSON.stringify(orders));
  }
}
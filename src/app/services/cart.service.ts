import { Injectable } from '@angular/core';
import { CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'cc_cart';

  getItems(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  add(credit: CartItem['credit'], quantity: number): boolean {
    const items = this.getItems();
    const existing = items.find(i => i.credit.id === credit.id);
    const newQuantity = (existing?.quantity || 0) + quantity;

    if (newQuantity > credit.availableCredits) return false;

    if (existing) existing.quantity = newQuantity;
    else items.push({ credit, quantity });

    this.save(items);
    return true;
  }

  setQuantity(id: number, quantity: number): boolean {
    const items = this.getItems();
    const item = items.find(i => i.credit.id === id);
    if (!item || quantity < 1 || quantity > item.credit.availableCredits) return false;
    item.quantity = quantity;
    this.save(items);
    return true;
  }

  remove(id: number): void {
    this.save(this.getItems().filter(i => i.credit.id !== id));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  total(): number {
    return this.getItems().reduce((sum, i) => sum + i.credit.price * i.quantity, 0);
  }

  credits(): number {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
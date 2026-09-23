import { Injectable } from '@angular/core';
import { Role, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'cc_users';
  private currentKey = 'cc_current_user';

  constructor() {
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify([
        { id: 1, name: 'Demo Buyer', email: 'buyer@example.com', password: '123456', role: 'buyer' },
        { id: 2, name: 'Demo Seller', email: 'seller@example.com', password: '123456', role: 'seller' }
      ]));
    }
  }

  private users(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  register(name: string, email: string, password: string, role: Role): boolean {
    const users = this.users();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return false;
    users.push({ id: Date.now(), name, email, password, role });
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return false;
    localStorage.setItem(this.currentKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.currentKey);
  }

  current(): User | null {
    const data = localStorage.getItem(this.currentKey);
    return data ? JSON.parse(data) : null;
  }

  updateName(name: string): void {
    const user = this.current();
    if (!user) return;
    const users = this.users();
    const index = users.findIndex(u => u.id === user.id);
    if (index < 0) return;
    users[index].name = name;
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.currentKey, JSON.stringify(users[index]));
  }
}
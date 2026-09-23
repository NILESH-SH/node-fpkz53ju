import { Injectable } from '@angular/core';
import { CarbonCredit } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CarbonCreditService {
  private key = 'cc_credits';

  private defaults: CarbonCredit[] = [
    {
      id: 1, projectName: 'Rajasthan Solar Farm', category: 'Solar Energy',
      description: 'Solar project producing clean electricity and reducing emissions.',
      location: 'Rajasthan, India', price: 800, availableCredits: 500,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900'
    },
    {
      id: 2, projectName: 'Gujarat Wind Energy Project', category: 'Wind Energy',
      description: 'Wind energy project generating renewable electricity.',
      location: 'Gujarat, India', price: 950, availableCredits: 350,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900'
    },
    {
      id: 3, projectName: 'Green Forest Project', category: 'Reforestation',
      description: 'Reforestation project supporting carbon absorption and biodiversity.',
      location: 'Uttarakhand, India', price: 700, availableCredits: 600,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900'
    },
    {
      id: 4, projectName: 'Himalayan Hydro Project', category: 'Hydroelectric',
      description: 'Clean hydroelectric power generation project.',
      location: 'Himachal Pradesh, India', price: 850, availableCredits: 400,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=900'
    },
    {
      id: 5, projectName: 'Punjab Biomass Energy', category: 'Biomass',
      description: 'Biomass project using agricultural waste for clean energy.',
      location: 'Punjab, India', price: 650, availableCredits: 450,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900'
    },
    {
      id: 6, projectName: 'Delhi Waste Management', category: 'Waste Management',
      description: 'Waste management project reducing landfill emissions.',
      location: 'Delhi, India', price: 600, availableCredits: 300,
      sellerId: 2, sellerName: 'Demo Seller',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900'
    }
  ];

  constructor() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.defaults));
    }
  }

  getAll(): CarbonCredit[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: number): CarbonCredit | undefined {
    return this.getAll().find(c => c.id === id);
  }

  getBySeller(id: number): CarbonCredit[] {
    return this.getAll().filter(c => c.sellerId === id);
  }

  add(credit: Omit<CarbonCredit, 'id'>): void {
    const items = this.getAll();
    items.push({ ...credit, id: Date.now() });
    this.save(items);
  }

  update(credit: CarbonCredit): void {
    const items = this.getAll();
    const index = items.findIndex(c => c.id === credit.id);
    if (index >= 0) {
      items[index] = credit;
      this.save(items);
    }
  }

  delete(id: number): void {
    this.save(this.getAll().filter(c => c.id !== id));
  }

  reduce(id: number, quantity: number): void {
    const credit = this.getById(id);
    if (credit) {
      credit.availableCredits -= quantity;
      this.update(credit);
    }
  }

  private save(items: CarbonCredit[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarbonCredit } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { CarbonCreditService } from '../../services/carbon-credit.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  user = this.auth.current();
  listings: CarbonCredit[] = [];
  orders = this.user ? this.orderService.byBuyer(this.user.id) : [];
  editingId: number | null = null;
  message = '';

  categories = [
    'Solar Energy', 'Wind Energy', 'Reforestation',
    'Hydroelectric', 'Biomass', 'Waste Management'
  ];

  listingForm = {
    projectName: '',
    category: 'Solar Energy',
    description: '',
    location: '',
    price: 1,
    availableCredits: 1,
    image: ''
  };

  profileName = this.user?.name || '';

  constructor(
    public auth: AuthService,
    private carbon: CarbonCreditService,
    private orderService: OrderService
  ) {
    this.loadListings();
  }

  loadListings(): void {
    const user = this.auth.current();
    this.listings = user ? this.carbon.getBySeller(user.id) : [];
  }

  get totalCredits(): number {
    return this.orders.reduce((sum, o) => sum + o.totalCredits, 0);
  }

  get totalSpent(): number {
    return this.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  }

  get availableCredits(): number {
    return this.listings.reduce((sum, c) => sum + c.availableCredits, 0);
  }

  saveProfile(): void {
    if (!this.profileName.trim()) return;
    this.auth.updateName(this.profileName.trim());
    this.user = this.auth.current();
    this.message = 'Profile updated.';
  }

  saveListing(): void {
    const user = this.auth.current();
    if (!user || !this.validListing()) return;

    if (this.editingId === null) {
      this.carbon.add({
        ...this.listingForm,
        sellerId: user.id,
        sellerName: user.name
      });
      this.message = 'Listing added successfully.';
    } else {
      this.carbon.update({
        id: this.editingId,
        ...this.listingForm,
        sellerId: user.id,
        sellerName: user.name
      });
      this.message = 'Listing updated successfully.';
    }

    this.resetListing();
    this.loadListings();
  }

  edit(item: CarbonCredit): void {
    this.editingId = item.id;
    this.listingForm = {
      projectName: item.projectName,
      category: item.category,
      description: item.description,
      location: item.location,
      price: item.price,
      availableCredits: item.availableCredits,
      image: item.image
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(id: number): void {
    if (!confirm('Delete this listing?')) return;
    this.carbon.delete(id);
    this.loadListings();
    this.message = 'Listing deleted.';
  }

  resetListing(): void {
    this.editingId = null;
    this.listingForm = {
      projectName: '',
      category: 'Solar Energy',
      description: '',
      location: '',
      price: 1,
      availableCredits: 1,
      image: ''
    };
  }

  private validListing(): boolean {
    return !!this.listingForm.projectName &&
      !!this.listingForm.category &&
      !!this.listingForm.description &&
      !!this.listingForm.location &&
      this.listingForm.price > 0 &&
      this.listingForm.availableCredits > 0 &&
      !!this.listingForm.image;
  }
}
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductStatisticsComponent } from "../product-statistics/product-statistics.component";
import { Product, Review, Role, Comment } from '../../utils';
import { DataProviderService } from '../../services/data-provider.service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, MatButtonModule, MatCardModule, ProductReviewComponent, ProductStatisticsComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})

export class ProductsListComponent {
  products: Product[] = [];
  isReviewView: boolean = false;

  @Input()
  role: Role | null = null;

  constructor(private dataProvider: DataProviderService) {
    this.products.push({id: 0, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
    this.products.push({id: 1, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
    this.products.push({id: 2, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
  }

  switchToReviewView(product: Product) {
    this.isReviewView = true;
    this.dataProvider.setCurrentProduct(product);
  }

  backToProductsList() {
    this.isReviewView = false;
    this.dataProvider.setCurrentProduct(null);
  }

  isCustomer() {
    return this.role != null && this.role == Role.customer;
  }

  isAdmin() {
    return this.role != null && this.role == Role.admin;
  }
}

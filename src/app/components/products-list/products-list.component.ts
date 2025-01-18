import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductStatisticsComponent } from "../product-statistics/product-statistics.component";
import { Product, Review, Role, Comment } from '../../utils';
import { DataProviderService } from '../../services/data-provider.service';
import { ProductHistogramComponent } from "../product-histogram/product-histogram.component";

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, MatButtonModule, MatCardModule, ProductReviewComponent, ProductStatisticsComponent, ProductHistogramComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})

export class ProductsListComponent {
  products: Product[] = [];
  isReviewView: boolean = false;

  @Input()
  role: Role | null = null;

  constructor(private dataProvider: DataProviderService) {
    this.products.push({id: 0, name: 'Smartphone', description: 'A high-performance smartphone with a 6.5-inch display, fast charging, and advanced camera features for stunning photos and videos.'});
    this.products.push({id: 1, name: 'Wireless Headphones', description: 'Premium wireless headphones with noise-canceling technology, long battery life, and a comfortable fit for all-day listening.'});
    this.products.push({id: 2, name: 'Smart TV', description: 'A sleek and smart 50-inch 4K Ultra HD TV with built-in streaming services, HDR support, and easy voice control integration.'});
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

  getProductsDisplayNames() {
    let names: string[] = [];
    this.products.forEach((product) => {
      names.push(product.id + '-' + product.name);
    });
    return names;
  }

  getProductsAverageRatings() {
    let ratingsList: number[] = [];
    let ratingsMap = this.dataProvider.computeProductsAverageRatings();

    this.products.forEach((product) => {
      if(ratingsMap.has(product.id)) {
        let avgRating = ratingsMap.get(product.id);
        ratingsList.push(avgRating != null ? avgRating : 0);
      } else {
        ratingsList.push(0);
      }
    });

    return ratingsList;
  }
}

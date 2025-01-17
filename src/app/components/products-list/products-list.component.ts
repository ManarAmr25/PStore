import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { Product, Role } from '../../utils';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, MatButtonModule, MatCardModule, ProductReviewComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductsListComponent {
  products: Product[] = [];
  isSubmitReview: boolean = false;
  currentSelectedProduct: Product | null = null;
  reviews = new Map<number, number>();

  @Input()
  role: Role | null = null;

  constructor() {
    this.products.push({id: 0, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
    this.products.push({id: 1, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
    this.products.push({id: 2, name: 'product', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'});
  }

  switchToSubmitReview(product: Product) {
    this.isSubmitReview = true;
    this.currentSelectedProduct = product;
  }

  newReviewSubmitted(review: {id: number, score: number}) {
    this.reviews.set(review.id, review.score);
    console.log('>>>>>>> new review submitted, id = ', review.id, ', score = ', review.score);
  }

  backToProductsList() {
    this.isSubmitReview = false;
    this.currentSelectedProduct = null;
  }
}

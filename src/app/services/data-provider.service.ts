import { Injectable } from '@angular/core';
import { Product, Review } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private currentProduct: Product | null = null;
  private reviews = new Map<number, Review[]>;

  constructor() {}

  addProductReview(id: number, review: Review) {
    if(this.reviews.has(id)) {
      let productReviews = this.reviews.get(id);
      if (productReviews != null) {
        productReviews.push(review);
        return;
      }
    }

    this.reviews.set(id, [review]);
  }

  getProductReviews(id: number) {
    if(this.reviews.has(id)) {
      return this.reviews.get(id);
    }
    return [];
  }

  setCurrentProduct(product: Product | null) {
    this.currentProduct = product;
  }

  getCurrentProduct(): Product | null {
    return this.currentProduct;
  }

  getCurrentProductId(): number {
    return this.currentProduct == null ? -1 : this.currentProduct.id;
  }

  getCurrentProductName(): string {
    return this.currentProduct == null ? '' : this.currentProduct.name;
  }

  getCurrentProductDescription(): string {
    return this.currentProduct == null ? '' : this.currentProduct.description;
  }

  getCurrentProductReviews(): Review[] {
    if(this.currentProduct != null && this.reviews.has(this.currentProduct.id)) {
      let currentList = this.reviews.get(this.currentProduct.id);
      if (currentList != null) {
        return currentList;
      }
    }
    return [];
  }

}

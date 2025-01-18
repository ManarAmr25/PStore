import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review, Product, Comment, Constants } from '../../utils';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { DataProviderService } from '../../services/data-provider.service';
import { ProductHistogramComponent } from '../product-histogram/product-histogram.component';



@Component({
  selector: 'app-product-statistics',
  imports: [CommonModule, MatListModule, MatCardModule, ProductHistogramComponent],
  templateUrl: './product-statistics.component.html',
  styleUrl: './product-statistics.component.css',
})
export class ProductStatisticsComponent {

  reviews: Review[] = [];

  constructor(private dataProvider: DataProviderService){
    this.reviews = this.dataProvider.getCurrentProductReviews();
  }

  getCurrentProductId(): number {
    return this.dataProvider.getCurrentProductId();
  }

  getCurrentProductName(): string {
    return this.dataProvider.getCurrentProductName();
  }

  getCurrentProductDescription(): string {
    return this.dataProvider.getCurrentProductDescription();
  }

  getCurrentProductAverageRating(): number {
    return this.dataProvider.computeCurrentProductAverageRating();
  }

  getCurrentProductReviewsCount(): number {
    return this.dataProvider.computeCurrentProductReviewsCount();
  }

  getRatingsCount(){
    const ratingCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars rating
    let reviews = this.dataProvider.getCurrentProductReviews();

    reviews.forEach((reviews) => {
      let score = Math.ceil(Math.max(Math.min(reviews.score,
                                                Constants.SCORE_UPPER_BOUND),
                              Constants.SCORE_LOWER_BOUND));
      ratingCounts[score - 1] += 1;
    });

    return ratingCounts;
  }

  getHistogramLabels() {
    return ['0-1', '1-2', '2-3', '3-4', '4-5'];
  }

}

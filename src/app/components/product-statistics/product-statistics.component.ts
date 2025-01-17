import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review, Product, Comment } from '../../utils';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { DataProviderService } from '../../services/data-provider.service';
import { HistogramComponent } from './histogram/histogram.component';



@Component({
  selector: 'app-product-statistics',
  imports: [CommonModule, MatListModule, MatCardModule, HistogramComponent],
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

}

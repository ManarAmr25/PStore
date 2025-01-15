import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductReviewComponent } from './components/product-review/product-review.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductReviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PStore';
}

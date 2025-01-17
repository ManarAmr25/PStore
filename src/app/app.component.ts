import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PStore';
}

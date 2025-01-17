import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Role } from './utils';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductsListComponent, MatButtonModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  role: Role | null = null;

  continueAsCustomer() {
    this.role = Role.customer;
  }

  continueAsAdmin() {
    this.role = Role.admin;
  }

  back() {
    this.role = null;
  }

}

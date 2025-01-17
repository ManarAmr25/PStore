import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHistogramComponent } from './product-histogram.component';

describe('HistogramComponent', () => {
  let component: ProductHistogramComponent;
  let fixture: ComponentFixture<ProductHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductHistogramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

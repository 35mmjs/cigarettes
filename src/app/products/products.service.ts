import { Injectable } from '@angular/core';

import { Product } from './product';
import { products as data } from './product.data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  getProducts(): Product[] {
    return data;
  }

  getProduct(id: string) {
    return this.getProducts().find(p => p.id === id);
  }
}

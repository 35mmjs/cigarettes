import { Injectable } from '@angular/core';

export class CartItem {
  id: string;
  packetNum: number;
  cartonNum: number;
}


@Injectable({
  providedIn: 'root',
})
export class CartService {
  items = [];

  constructor(
  ) { }

  add(item: CartItem) {
    const idx = this.items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      this.items.splice(idx, 1, item);
    } else {
      this.items.push(item);
    }
    this.items = this.items.concat([]);
  }

  remove(id: string): void {
    const idx = this.items.findIndex(i => i.id === id);
    this.items.splice(idx, idx + 1);
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}

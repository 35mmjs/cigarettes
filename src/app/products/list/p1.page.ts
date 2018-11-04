import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../products.service';

@Component({
  selector: 'app-products-p1',
  templateUrl: 'p1.page.html',
  styleUrls: ['page.scss'],
})
export class ProductsPage implements OnInit {
  category: String;
  leisureProducts: Product[];
  sunshineProducts: Product[];
  scrollInterval = {};
  scrollTime = 50;
  scrollGap = 5;
  scrollDirection = {};
  scrollStatus = {};
  stopTimer = {};

  constructor(
    private service: ProductService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.leisureProducts = this.service.getProducts().filter(p => p.category === 'leisure');
    this.sunshineProducts = this.service.getProducts().filter(p => p.category === 'sunshine');

    this.startVerticalScroll(document.getElementsByClassName('block-2')[0], 'b2');
    this.startVerticalScroll(document.getElementsByClassName('block-1')[0], 'b1');
  }

  goToDetail(id): void {
    this.router.navigate([`/products/${id}`]);
  }

  startVerticalScroll(element, id) {
    if (this.scrollInterval[id]) {
      clearInterval(this.scrollInterval[id]);
    }

    const height = element.clientHeight;
    const scrollHeight = element.scrollHeight;
    element.scrollTop = scrollHeight - height;

    // 如果高度相等，延迟半秒再试
    if (height === scrollHeight) {
      setTimeout(() => {
        this.startVerticalScroll(element, id);
      }, 500);
      return;
    }

    this.scrollDirection[id] = 'top';
    this.scrollInterval[id] = setInterval(() => {
      if (this.scrollStatus[id] && this.scrollStatus[id] === 'stop') {
        return;
      }

      let scrollTop = element.scrollTop;
      if (this.scrollDirection[id] === 'bottom' && scrollTop + height >= scrollHeight) {
        // this.scrollDirection[id] = 'top';
        element.scrollTop = 0;
        return;
      }

      if (this.scrollDirection[id] === 'top' && scrollTop <= 0) {
        // this.scrollDirection[id] = 'bottom';
        element.scrollTop = scrollHeight - height;
        return;
      }

      if (this.scrollDirection[id] === 'bottom') {
        scrollTop += this.scrollGap;
      } else {
        scrollTop -= this.scrollGap;
      }
      element.scrollTop = scrollTop;
    }, this.scrollTime);
  }

  stopScroll(id) {
    this.scrollStatus[id] = 'stop';
    if (this.stopTimer[id]) {
      clearTimeout(this.stopTimer[id]);
    }
    this.stopTimer[id] = setTimeout(() => {
      this.scrollStatus[id] = 'go';
    }, 5000);
  }
}

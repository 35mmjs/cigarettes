import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../products.service';

@Component({
  selector: 'app-products-p2',
  templateUrl: 'p2.page.html',
  styleUrls: ['page.scss'],
})
export class ProductsPage implements OnInit {
  category: String;
  products: Product[];
  scrollInterval = {};
  scrollTime = 50;
  scrollGap = 5;
  scrollDirection = 'top';
  scrollStatus = {};
  stopTimer = {};

  constructor(
    private router: Router,
    private service: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.products = this.service.getProducts().filter(p => p.category === 'origin');
    this.startVerticalScroll(document.getElementsByClassName('block-3')[0], 'b3');
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

    this.scrollInterval[id] = setInterval(() => {
      if (this.scrollStatus[id] && this.scrollStatus[id] === 'stop') {
        return;
      }

      let scrollTop = element.scrollTop;
      if (this.scrollDirection === 'bottom' && scrollTop + height >= scrollHeight) {
        this.scrollDirection = 'top';
      }

      if (this.scrollDirection === 'top' && scrollTop <= 0) {
        // this.scrollDirection = 'bottom';
        element.scrollTop = scrollHeight - height;
        return;
      }

      if (this.scrollDirection === 'bottom') {
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

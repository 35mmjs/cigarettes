import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Slides } from '@ionic/angular';
import { ProductService } from '../products.service';
import { CartService } from '../../cart/cart.service';
import { Product } from '../product';

@Component({
  selector: 'app-productDetail',
  templateUrl: 'productDetail.page.html',
  styleUrls: ['productDetail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  slides: any[];
  @ViewChild(Slides) slideInstance: Slides;
  product: Product;
  packetNum = 0;
  cartonNum = 0;
  total = '0';
  added = false;
  slideOpts = { slidesPerView: 'auto', effect: 'flip'  };
  slideDesc = {
    title: '',
    desc: '',
  };

  constructor(
    private service: ProductService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    const routeParams = this.activeRoute.snapshot.params;
    this.product = this.service.getProduct(routeParams.id);
    this.slides = this.product.slides;
    this.added = false;
    this.onSlideChange();
    this.slideInstance.startAutoplay();
  }

  async onSlideChange() {
    const currentIndex = await this.slideInstance.getActiveIndex();
    this.slideDesc.title = this.slides[currentIndex].title;
    this.slideDesc.desc = this.slides[currentIndex].desc;
  }

  minus(type: String): void {
    if (this.added) {
      return;
    }
    if (type === 'packet') {
      this.packetNum--;
      if (this.packetNum < 0 ) {
        this.packetNum = 0;
      }
    }
    if (type === 'carton') {
      this.cartonNum = this.cartonNum - 1;
      if (this.cartonNum < 0) {
        this.cartonNum = 0;
      }
    }
    this.calc();
  }

  add(type: string): void {
    if (this.added) {
      return;
    }
    if (type === 'packet') {
      this.packetNum++;
    }
    if (type === 'carton') {
      this.cartonNum++;
    }
    this.calc();
  }

  calc() {
    this.total = ((this.product.price as number) * (this.packetNum + this.cartonNum * 10)).toFixed(2);
  }

  addToCart() {
    if (parseInt(this.total, 10) === 0) {
      return;
    }
    this.added = true;
    this.cartService.add({
      id: this.product.id,
      cartonNum: this.cartonNum,
      packetNum: this.packetNum,
    })
  }
  goToCart() {
    this.router.navigate(['/cart']);
  }
  goBack() {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { CartService } from './cart.service';
import { ProductService } from '../products/products.service';

declare global {
  interface PluginRegistry {
    BizAPI?: BizAPI;
  }
}

interface BizAPI {
  StartPay(any): Promise<any>;
}

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
})
export class CartPage implements OnInit {
  items = [];
  productMap = {};
  totalAmount = '0';
  paying = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private localtion: Location,
    private router: Router,
    private alertController: AlertController,
  ) {

  }

  ngOnInit() {
    this.productMap = this.productService.getProducts().reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});
    this.getItems();
    this.calcTotalAmout();
  }

  getItems() {
    this.items = this.cartService.getItems().map(i => ({
      ...i,
      total:  ((this.productMap[i.id].price as number) * (i.packetNum + i.cartonNum * 10)).toFixed(2),
      ...this.productMap[i.id],
    }));
  }

  remove(id) {
    this.cartService.remove(id);
    this.getItems();
    this.calcTotalAmout();
  }

  minus(id, type: String): void {
    const idx = this.items.findIndex(i => id === i.id);
    const item = this.items[idx];
    if (type === 'packet') {
      item.packetNum--;
      if (item.packetNum < 0 ) {
        item.packetNum = 0;
      }
    }
    if (type === 'carton') {
      item.cartonNum = item.cartonNum - 1;
      if (item.cartonNum < 0) {
        item.cartonNum = 0;
      }
    }
    item.total = this.calc(item);
    this.calcTotalAmout();
  }

  add(id, type: string): void {
    const idx = this.items.findIndex(i => id === i.id);
    const item = this.items[idx];
    if (item.added) {
      return;
    }
    if (type === 'packet') {
      item.packetNum++;
    }
    if (type === 'carton') {
      item.cartonNum++;
    }
    item.total = this.calc(item);
    this.calcTotalAmout();
  }

  calc(item) {
    return ((item.price as number) * (item.packetNum + item.cartonNum * 10)).toFixed(2);
  }

  calcTotalAmout() {
    let totalAmount = 0;
    this.items.forEach(i => totalAmount += parseFloat(i.total));
    this.totalAmount = totalAmount.toFixed(2);
  }

  goBack() {
    this.router.navigate(['/p1']);
  }

  pay() {
    this.paying = true;
    const payRequest = {
      'total_amount': this.totalAmount,
      'goods_detail': this.items.map(item => ({
        'goods_id': item.id,
        'goods_name': item.id,
        'price': item.price,
        'sail_price': item.price,
        'discountable_type': '0',
        'packetQuantity': item.packetNum,
        'cartonQuantity': item.cartonNum,
      })),
    };

    Plugins.BizAPI.StartPay(payRequest).then((res) => {
      if (res.success) {
        this.router.navigate(['/pay']);
      } else {
        this.presentAlert({
          header: '支付失败!',
          message: res.errorMessage,
        });
      }
      this.paying = false;
    });
  }

  async presentAlert({ header, message }) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}

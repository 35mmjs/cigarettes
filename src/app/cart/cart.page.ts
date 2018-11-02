import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { CartService } from './cart.service';
import { ProductService } from '../products/products.service';
import { PayService } from '../pay/pay.service';

declare global {
  interface PluginRegistry {
    BizAPI?: BizAPI;
  }
}

interface BizAPI {
  StartPay(): Promise<any>;
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
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private localtion: Location,
    private payService: PayService,
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
    // this.payService.tradePay();
    Plugins.BizAPI.StartPay().then(() => {
      this.presentAlert();
    });
    // this.router.navigate(['/pay']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }
}

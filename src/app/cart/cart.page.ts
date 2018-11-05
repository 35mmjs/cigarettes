import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { PluginService } from '../plugin.service';
import { CartService } from './cart.service';
import { PayService } from '../pay/pay.service';
import { ProductService } from '../products/products.service';

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
    private payService: PayService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private pluginService: PluginService,
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

  async pay() {
    const prepare = await this.loadingController.create({
      message: '正在准备支付...',
    });

    prepare.present();
    const payRequest = {
      'total_amount': this.totalAmount,
      'goods_detail': this.items.map(item => ({
        'goods_id': item.id,
        'goods_name': item.id,
        'price': item.price,
        'sail_price': item.price,
        'discountable_type': '0',
        'quantity': '1',
        'packetQuantity': item.packetNum,
        'cartonQuantity': item.cartonNum,
      })),
    };

    this.pluginService.StartPay(payRequest).then((res: any) => {
      prepare.dismiss();
      if (res.success) {
        try {
          this.payService.setOrderInfo(JSON.parse(res.data));
          this.router.navigate(['/pay']);
        } catch {}
      } else {
        this.presentAlert({
          header: '订单创建失败!',
          message: res.errorMessage,
        });
      }
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

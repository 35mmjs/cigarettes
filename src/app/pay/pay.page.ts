import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import QRious from 'qrious';

import { PluginService } from '../plugin.service';
import { PayService } from './pay.service';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.page.html',
  styleUrls: ['pay.page.scss'],
})
export class PayPage implements OnInit {
  qrcode = '';
  queryInterval = null;
  maxPollingTime = 10;
  pollingCount = 0;
  constructor(
    private router: Router,
    private payService: PayService,
    private cartService: CartService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private pluginService: PluginService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    if (this.payService.orderInfo.code_url) {
      this.drawQrCode();
    } else {
      // TODO: 需要监听 code_url 变化
      setTimeout(() => {
        this.drawQrCode();
      }, 1000);
    }

    this.queryPayResult();
  }

  drawQrCode() {
    const qr = new QRious({
      // element: document.getElementById('qr'),
      size: 300,
      value: this.payService.orderInfo.code_url,
      background: 'white',
      foreground: 'black',
      backgroundAlpha: 1,
      foregroundAlpha: 1,
      mime: 'image/png',
    });

    this.qrcode = qr.toDataURL();
  }

  goBack() {
    clearInterval(this.queryInterval);
    this.router.navigate(['/cart']);
  }

  queryPayResult() {
    if (this.queryInterval) {
      clearInterval(this.queryInterval);
    }

    this.queryInterval = setInterval(() => {
      this.pollingCount ++;
      if (this.pollingCount > this.maxPollingTime) {
        clearInterval(this.queryInterval);
        (async () => {
          const prepare = await this.loadingController.create({
            message: '支付超时，5秒后返回购物车...请重新生成订单',
            duration: 5000,
          });
          prepare.present();
          setTimeout(() => {
            this.goBack();
          }, 5000);
        })();
      }

      const { orderInfo } = this.payService;
      this.pluginService.QueryPayResult({
        'out_trade_no': orderInfo.out_trade_no,
      }).then((res: any) => {
        if (res.success) {
          if (res.payStatus === 'polling') {
            return;
          }

          (async () => {
            await this.paySuccess();
            await this.callPrint();
          })();
        } else {
          this.payFailed(res.errorMessage);
        }
      });
    }, 5000);
  }

  async presentAlert({ header, message }) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async paySuccess() {
    clearInterval(this.queryInterval);
    const prepare = await this.loadingController.create({
      message: '支付成功，正在打印凭条...',
      duration: 1000,
    });
    prepare.present();
  }

  async payFailed(errorMessage) {
    clearInterval(this.queryInterval);
    this.presentAlert({
      header: '支付失败!',
      message: errorMessage,
    });
  }

  async callPrint() {
    const productMap = this.productService.getProducts().reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    const items = this.cartService.getItems().map(i => ({
      ...i,
      total: ((productMap[i.id].price as number) * (i.packetNum + i.cartonNum * 10)).toFixed(2),
      ...productMap[i.id],
    }));

    this.pluginService.Print({
      'items': items,
    }).then((res: any) => {
      if (res.success) {
        // 打印成功提示
        this.presentAlert({
          header: '打印成功!',
          message: '请取走票据',
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.printFailed(res.errorMessage);
        // TODO: 增加重试逻辑
        // 实在打印不成功，就弹出打印清单，联系管理员
      }
    });
  }

  async printFailed(errorMessage) {
    this.presentAlert({
      header: '打印失败!',
      message: errorMessage,
    });
  }
}

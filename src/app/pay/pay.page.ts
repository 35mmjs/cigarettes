import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import QRious from 'qrious';

import { PayService } from './pay.service';

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
    private loadingController: LoadingController,
    private alertController: AlertController,
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
      Plugins.BizAPI.QueryPayResult({
        'out_trade_no': orderInfo.out_trade_no,
      }).then(res => {
        if (res.success) {
          if (res.payStatus === 'polling') {
            return;
          }

          (async () => {
            await this.paySuccess();
            // TODO: call Print
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
}

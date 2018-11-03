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
  maxPollingTime = 15;
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
    this.router.navigate(['/cart']);
  }

  queryPayResult() {
    if (this.queryInterval) {
      clearInterval(this.queryInterval);
    }

    this.queryInterval = setInterval(() => {
      this.pollingCount ++;
      if (this.pollingCount > this.maxPollingTime) {
        (async () => {
          const prepare = await this.loadingController.create({
            message: '支付超时，请重试...',
          });
          prepare.present();
          this.goBack();
        })();
      }

      const { orderInfo } = this.payService;
      Plugins.BizAPI.QueryPayResult({
        'out_trade_no': orderInfo.out_trade_no,
      }).then(res => {
        if (res.success) {
          // 支付成功，正在打印凭条
          (async () => {
            const prepare = await this.loadingController.create({
              message: '支付成功，正在打印凭条...',
            });
            prepare.present();

            // TODO: call Print
          })();
        } else {
          this.presentAlert({
            header: '支付失败!',
            message: res.errorMessage,
          });
        }
      });
    }, 3000);
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

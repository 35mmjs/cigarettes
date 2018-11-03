import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import QRious from 'qrious';

import { PayService } from './pay.service';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.page.html',
  styleUrls: ['pay.page.scss'],
})
export class PayPage implements OnInit {
  qrcode = '';
  constructor(
    private router: Router,
    private payService: PayService,
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
}

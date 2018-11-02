import { Injectable } from '@angular/core';

interface OrderInfo {
  khbh: string;
  out_trade_no: string;
  prepay_id: string;
  w_khbh_id: string;
  code_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PayService {
  orderInfo: OrderInfo = {} as OrderInfo;
  constructor(
  ) { }

  setOrderInfo(orderInfo: OrderInfo) {
    this.orderInfo = orderInfo;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const tradePayUrl = 'http://paytest.zxhsd.com/services/Exchange?wsdl';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class PayService {
  qrcodeUrl = 'weixin://wxpay/bizpayurl?pr=u2LRUip';
  constructor(private http: HttpClient) { }
  tradePay() {
    this.http.post(tradePayUrl, {}, httpOptions)
      .subscribe(res => {
        console.log(res);
      });
  }

  print() {

  }
}

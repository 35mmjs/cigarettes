import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PluginService {
  constructor(
    private http: HttpClient,
  ) { }

  StartPay(payRequst) {
    return this.http.post('/startPay', payRequst).toPromise();
  }
  QueryPayResult(query) {
    return this.http.post('/queryPayResult', query).toPromise();
  }
  Print(items) {
    return this.http.post('/print', items).toPromise();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.page.html',
  styleUrls: ['pay.page.scss'],
})
export class PayPage implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}

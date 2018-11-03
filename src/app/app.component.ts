import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu = true;
  active = false;
  interval: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private cart: CartService,
    private location: Location,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.initialCartRecircle();

        if (['/', '/p1', '/p2', '/p3', '/cart'].indexOf(e.url) > -1) {
          this.showMenu = true;
        } else {
          this.showMenu = false;
        }
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initialCartRecircle() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.cart.clear();
      if (this.location.path().indexOf('pay') === -1) {
        this.router.navigate(['/p1']);
      }
    }, 5 * 60 * 1000);
  }
}

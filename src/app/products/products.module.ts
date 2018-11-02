import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsPage as ProductsPage1 } from './list/p1.page';
import { ProductsPage as ProductsPage2 } from './list/p2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductsPage1
      }
    ])
  ],
  declarations: [ProductsPage1]
})
export class P1 {}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductsPage2
      }
    ])
  ],
  declarations: [ProductsPage2]
})
export class P2 {}

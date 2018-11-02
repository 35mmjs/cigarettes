import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'p1', pathMatch: 'full' },
  { path: 'p1', loadChildren: './products/products.module#P1' },
  { path: 'p2', loadChildren: './products/products.module#P2' },
  { path: 'products/:id', loadChildren: './products/detail/productDetail.module' },
  { path: 'cart', loadChildren: './cart/cart.module' },
  { path: 'pay', loadChildren: './pay/pay.module' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

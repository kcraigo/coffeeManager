import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule)},
  { path: 'brands', loadChildren: () => import('./brands/brands.module').then(m => m.BrandsModule)},
  { path: 'giftcards', loadChildren: () => import('./giftcards/giftcards.module').then(m => m.GiftcardsModule)},
  { path: 'code', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path:'', pathMatch: 'full', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: '**', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)}
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    // Don't perform initial navigation in iframes
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

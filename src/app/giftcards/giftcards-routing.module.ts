import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { GiftcardsComponent } from './giftcards.component';

const routes: Routes = [
  {path:'', component: GiftcardsComponent, canActivate : [MsalGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftcardsRoutingModule {
  static components = [GiftcardsComponent]
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrandsComponent } from './brands.component';

const routes: Routes = [
  {path:'', component: BrandsComponent, canActivate : [MsalGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule {
  static components = [ BrandsComponent ]
}

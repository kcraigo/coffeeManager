import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftcardsRoutingModule } from './giftcards-routing.module';


@NgModule({
  declarations: [GiftcardsRoutingModule.components],
  imports: [
    CommonModule,
    GiftcardsRoutingModule
  ]
})
export class GiftcardsModule { }

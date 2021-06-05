import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [BrandsComponent],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    MaterialModule
  ]
})
export class BrandsModule { }

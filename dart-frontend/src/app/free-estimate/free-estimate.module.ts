import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeEstimateRoutingModule } from './free-estimate-routing.module';
import { FreeEstimateComponent } from './free-estimate/free-estimate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [FreeEstimateComponent],
  imports: [
    CommonModule,
    FreeEstimateRoutingModule,
    HeaderModule,
    HomePagesModule,
    ReactiveFormsModule,
  ],
})
export class FreeEstimateModule {}

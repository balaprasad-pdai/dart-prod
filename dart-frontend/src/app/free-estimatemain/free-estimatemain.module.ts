import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeEstimatemainRoutingModule } from './free-estimatemain-routing.module';
import { FreeEstimatemainComponent } from './free-estimatemain/free-estimatemain.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { HomePagesModule } from '../home-pages/home-pages.module';

@NgModule({
  declarations: [FreeEstimatemainComponent],
  imports: [
    CommonModule,
    FreeEstimatemainRoutingModule,
    HeaderModule,
    HomePagesModule,
    ReactiveFormsModule,
  ],
})
export class FreeEstimatemainModule {}

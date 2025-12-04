import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeEstimate1RoutingModule } from './free-estimate1-routing.module';
import { FreeEstimate1Component } from './free-estimate1/free-estimate1.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { BookingsModule } from '../bookings/bookings.module';

@NgModule({
  declarations: [FreeEstimate1Component],
  imports: [
    CommonModule,
    FreeEstimate1RoutingModule,
    HeaderModule,
    HomePagesModule,
    BookingsModule,
    ReactiveFormsModule,
  ],
})
export class FreeEstimate1Module {}

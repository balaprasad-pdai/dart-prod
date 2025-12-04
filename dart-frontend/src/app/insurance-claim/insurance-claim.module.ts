import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceClaimRoutingModule } from './insurance-claim-routing.module';
import { InsuranceClaimComponent } from './insurance-claim/insurance-claim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { HeaderModule } from '../header/header.module';
import { InsuranceComponent } from './insurance/insurance.component';
import { NonInsuranceComponent } from './non-insurance/non-insurance.component';
import { BookingsModule } from '../bookings/bookings.module';

@NgModule({
  declarations: [InsuranceClaimComponent, InsuranceComponent, NonInsuranceComponent],
  imports: [
    CommonModule,
    InsuranceClaimRoutingModule,
    HomePagesModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    BookingsModule
  ],
})
export class InsuranceClaimModule {}

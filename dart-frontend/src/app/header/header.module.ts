import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderRoutingModule } from './header-routing.module';
import { HeaderComponent } from './header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HeaderRoutingModule,
    ReactiveFormsModule,
    NgxOtpInputModule,
    FormsModule,
    CarouselModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingsDetailComponent } from './bookings-detail/bookings-detail.component';
import { BookingsHistoryComponent } from './bookings-history/bookings-history.component';
import { BookingsHistoryDetailComponent } from './bookings-history-detail/bookings-history-detail.component';
import { HeaderModule } from '../header/header.module';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedPackagesComponent } from './selected-packages/selected-packages.component';
import { ProfilePagesModule } from '../profile-pages/profile-pages.module';
import { ReversePipe, AssendPipe } from '../util.service';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    BookingsComponent,
    BookingsDetailComponent,
    BookingsHistoryComponent,
    BookingsHistoryDetailComponent,
    SelectedPackagesComponent,
    ReversePipe,
    AssendPipe,
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    HeaderModule,
    HomePagesModule,
    FormsModule,
    ProfilePagesModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports: [SelectedPackagesComponent],
})
export class BookingsModule {}

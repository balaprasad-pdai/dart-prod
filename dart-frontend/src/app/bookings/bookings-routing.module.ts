import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsDetailComponent } from './bookings-detail/bookings-detail.component';
import { BookingsHistoryDetailComponent } from './bookings-history-detail/bookings-history-detail.component';
import { BookingsHistoryComponent } from './bookings-history/bookings-history.component';
import { BookingsComponent } from './bookings/bookings.component';

const routes: Routes = [
  { path: '', component: BookingsComponent},
  { path: 'details', component: BookingsDetailComponent},
  { path: 'history', component: BookingsHistoryComponent},
  { path: 'history-details', component: BookingsHistoryDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }

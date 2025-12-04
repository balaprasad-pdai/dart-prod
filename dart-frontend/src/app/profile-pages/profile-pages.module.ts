import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePagesRoutingModule } from './profile-pages-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileAddressComponent } from './profile-address/profile-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { HeaderModule } from '../header/header.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ProfileComponent, ProfileAddressComponent],
  imports: [
    CommonModule,
    ProfilePagesRoutingModule,
    ReactiveFormsModule,
    HomePagesModule,
    HeaderModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [ProfileAddressComponent],
})
export class ProfilePagesModule {}

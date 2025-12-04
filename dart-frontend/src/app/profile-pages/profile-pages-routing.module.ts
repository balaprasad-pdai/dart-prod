import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAddressComponent } from './profile-address/profile-address.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', component: ProfileComponent},
  {path: 'profile-address', component: ProfileAddressComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePagesRoutingModule { }

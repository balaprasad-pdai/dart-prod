import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderModule } from '../header/header.module';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { RouterModule, Routes } from '@angular/router';
// import { AboutUsRoutingModule } from './about-us-routing.module';

let routes: Routes = [
    { path: 'details', component: AboutUsComponent},
  ];

@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HeaderModule,
    HomePagesModule,
    // AboutUsRoutingModule,
   
  ]
})
export class AboutUsModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreeEstimate1Component } from './free-estimate1/free-estimate1.component';

const routes: Routes = [
  {path:'',component:FreeEstimate1Component}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeEstimate1RoutingModule { }

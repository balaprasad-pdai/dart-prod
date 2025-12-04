import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreeEstimateComponent } from './free-estimate/free-estimate.component';

const routes: Routes = [
  {path: "", component:FreeEstimateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeEstimateRoutingModule { }

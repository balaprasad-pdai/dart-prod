import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreeEstimatemainComponent } from './free-estimatemain/free-estimatemain.component';

const routes: Routes = [

  {path:'',component:FreeEstimatemainComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeEstimatemainRoutingModule { }

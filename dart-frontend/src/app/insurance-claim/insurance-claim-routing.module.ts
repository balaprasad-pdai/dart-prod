import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceClaimComponent } from './insurance-claim/insurance-claim.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { NonInsuranceComponent } from './non-insurance/non-insurance.component';

const routes: Routes = [
    {path: "", component:InsuranceClaimComponent,
      // children: [
      //   {path: "insurance", component:InsuranceComponent },
      //   {path: "non-insurance", component:NonInsuranceComponent }
      // ]
    },
    {path: "insurance", component:InsuranceComponent },
    {path: "non-insurance", component:InsuranceComponent }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceClaimRoutingModule { }

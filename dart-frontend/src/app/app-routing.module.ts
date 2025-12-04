import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home-pages/home-pages.module').then((m) => m.HomePagesModule),
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./blog-pages/blog-pages.module').then((m) => m.BlogPagesModule),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile-pages/profile-pages.module').then(
        (m) => m.ProfilePagesModule
      ),
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./bookings/bookings.module').then((m) => m.BookingsModule),
  },
  {
    path: 'header',
    loadChildren: () =>
      import('./header/header.module').then((m) => m.HeaderModule),
  },
  {
    path: 'free-estimate-vehicle-information',
    loadChildren: () =>
      import('./free-estimate/free-estimate.module').then(
        (m) => m.FreeEstimateModule
      ),
  },

  {
    path: 'free-estimate',
    loadChildren: () =>
      import('./free-estimatemain/free-estimatemain.module').then(
        (m) => m.FreeEstimatemainModule
      ),
  },

  {
    path: 'body-and-paint-repair',
    loadChildren: () =>
      import('./insurance-claim/insurance-claim.module').then(
        (m) => m.InsuranceClaimModule
      ),
  },

  {
    path: 'free-estimate-services',
    loadChildren: () =>
      import('./free-estimate1/free-estimate1.module').then(
        (m) => m.FreeEstimate1Module
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./home-pages/home-pages.module').then((m) => m.HomePagesModule),
  }, // Wildcard route.
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Injectable } from '@angular/core';
import {
  CanActivate,
  UrlTree,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

// Auth Services
import { UtilService } from '../util.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  isUserLoggedIn: boolean;
  constructor(private router: Router, private util: UtilService) {
    this.isUserLoggedIn = this.util.authHandler().loggedIn();
  }

  canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    this.isUserLoggedIn = this.util.authHandler().loggedIn();
    if (this.isUserLoggedIn) {
      if (state.url === '/') {
        this.router.navigate(['/dashboard']);
      }
      return true;
    }
    // * User not authenticated
    this.router.navigate(['/login']); //, { queryParams: { returnUrl: state.url } }
    return false;
  };
  canActivateChild = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    if (this.isUserLoggedIn) {
      return true;
    }
    // * User not authenticated
    this.router.navigate(['/dashboard'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  };
}

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UtilService } from '../util.service';

let headers: any;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  showAuthWpr = false;
  showModal = 0;
  displayLogin = 'none';
  private loginFromHeader = new Subject<string>();
  loginAnnounced$ = this.loginFromHeader.asObservable();
  constructor(
    private http: HttpClient,
    private util: UtilService,
    private router: Router
  ) {
    headers = this.util.getHttpHeaders();
  }

  announceLogin(mission: string) {
    this.loginFromHeader.next(mission);
  }

  getCityNames = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/city', { headers });
  };
  getOtp = (params: any): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.post<any>('/api/user/send-otp', params, { headers });
  };
  resendOtp = (params: any): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.post<any>('/api/user/resend-otp', params, { headers });
  };
  loginCustomer = (params: any): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.post<any>('/api/user/login-customer', params, { headers });
  };
  logout() {
    // Clear the loggedIn flag in localStorage and update the variable
    localStorage.setItem('loggedIn', 'false');
    this.showAuthWpr = false;
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

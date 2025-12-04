import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../../util.service';

let headers: any;

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient, private util: UtilService) {
    headers = this.util.getHttpHeaders();
  }

  login = (param: any): Observable<any> => {
    this.util.activeUrl = 2;
    const parameter = JSON.stringify(param);
    return this.http.post<any>('/api/auth', parameter, { headers });
  };
  getTeamMember = (params: any): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>(`/api/team-member${params}`, { headers });
  };

  forgotPwdSend = (param: any): Observable<any> => {
    this.util.activeUrl = 2;
    const parameter = JSON.stringify(param);
    return this.http.post<any>('/api/auth/forgot-password', parameter, {
      headers,
    });
  };

  ResetPassword = (param: any): Observable<any> => {
    this.util.activeUrl = 2;
    const parameter = JSON.stringify(param);
    return this.http.post<any>('/api/auth/reset-password', parameter, {
      headers,
    });
  };
  changePassword = (param: any): Observable<any> => {
    this.util.activeUrl = 2;
    const parameter = JSON.stringify(param);
    return this.http.post<any>('/api/user/change-password', parameter, {
      headers,
    });
  };
  /* verifyOtp =(param: any): Observable<any> => {
    return this.http.post<any>('/auth-service/api/v1/auth/verify-otp/',  param );
  }

  signupOtp =(param: any): Observable<any> => {
    return this.http.post<any>('/auth-service/api/v1/auth/signup-otp/',  param );

  }

  resendOtp =(param: any): Observable<any> => {
    return this.http.post<any>('/auth-service/api/v1/auth/resend-otp/',  param );

  }

  authenticateOtp =(param: any): Observable<any> => {
    return this.http.post<any>('/auth-service/api/v1/auth/authenticate/',  param );

  } */
}

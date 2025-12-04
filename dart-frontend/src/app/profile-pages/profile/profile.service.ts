import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilService } from 'src/app/util.service';
let headers: any;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  updateProfile: any;

  constructor(private http: HttpClient, private commonServise: UtilService) {}

  getProfile = (): Observable<any> => {
    return this.http.get<any>('/api/user', { headers });
  };

  uploadFile = (params: any): Observable<any> => {
    this.commonServise.activeUrl = 1;
    return this.http.post<any>('/api/uploads/file', params);
  };
  getSelectedProfileDetail = (id: string): Observable<any> => {
    this.commonServise.activeUrl = 1;
    return this.http.get<any>(`/api/user/${id}`, { headers });
  };
  updateProfileDetail = (param: any, id: string): Observable<any> => {
    this.commonServise.activeUrl = 1;
    return this.http.patch<any>(`/api/user/${id}`, param, {
      headers,
    });
  };
}

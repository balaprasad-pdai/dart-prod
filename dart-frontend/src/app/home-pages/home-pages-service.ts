import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../util.service';

let headers: any;

@Injectable({
  providedIn: 'root',
})
export class HomePagesService {
  constructor(private http: HttpClient, private util: UtilService) {
    headers = this.util.getHttpHeaders();
  }

  getCarModels = (
    brandId: any = undefined,
    name: string = ''
  ): Observable<any> => {
    this.util.activeUrl = 1;
    const param = brandId ? `?${name}=${brandId}` : '';
    return this.http.get<any>(`/api/public/car-model${param}`, { headers });
  };
  getBrands = (): Observable<any> => {
    return this.http.get<any>('/api/brands', { headers });
  };
  getServiceCategory = (): Observable<any> => {
    return this.http.get<any>('/api/categories', { headers });
  };
}

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../util.service';

let headers: any;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderComplete = false;
  constructor(private http: HttpClient, private util: UtilService) {
    headers = this.util.getHttpHeaders();
  }

  getCarModels = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/public/car-model', { headers });
  };
  getBrands = (): Observable<any> => {
    return this.http.get<any>('/api/brands', { headers });
  };
  getServiceCategory = (): Observable<any> => {
    return this.http.get<any>('/api/categories', { headers });
  };
  getAllPackages = (params: any = undefined): Observable<any> => {
    return params
      ? this.http.get<any>(`/api/package${params}`, { headers })
      : this.http.get<any>(`/api/package`, { headers });
  };
  getAllPackagesPrice = (): Observable<any> => {
    return this.http.get<any>('/api/package-price', { headers });
  };
  getPackagePricesByQuery = (
    modelId: any,
    cityId: any,
    fuelType: any
  ): Observable<any> => {
    return this.http.get<any>(
      `/api/package-price?modelId=${modelId}&cityId=${cityId}&fuelType=${fuelType}`,
      { headers }
    );
  };
  addToCartService = (userId: any, params: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.post<any>(`/api/shopping-cart/${userId}/modify`, params, {
      headers,
    });
  };
  getActiveCartService = (userId: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.get<any>(`/api/shopping-cart/${userId}/active`, {
      headers,
    });
  };
  updateActiveCartService = (userId: any, params: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.patch<any>(`/api/shopping-cart/${userId}/modify`, params, {
      headers,
    });
  };
  createOrderService = (userId: any, params: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.post<any>(`/api/order/${userId}/modify`, params, {
      headers,
    });
  };
  panelPriceLoading = (
    modelId: any,
    cityId: any,
    fuelType: any,
    packageId: any
  ): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>(
      `/api/panel-price/public/filters?modelId=${modelId}&cityId=${cityId}&fuelType=${fuelType}`,
      {
        headers,
      }
    );
  };
  getActiveOrderDetailService = (userId: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.get<any>(`/api/order/${userId}/me`, {
      headers,
    });
  };
  updateTimeLineOrder = (
    userId: any,
    orderId: any,
    params: any
  ): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.post<any>(
      `/api/order/${userId}/${orderId}/timeline`,
      params,
      {
        headers,
      }
    );
  };
  getAddOnList = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>(`/api/grade`, { headers });
  };
  getTypeOfWork = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>(`/api/type-of-works`, { headers });
  };
  getAllOrderDetails = (userId: any): Observable<any> => {
    this.util.activeUrl = 2;
    return this.http.get<any>(`/api/order?userId=${userId}`, { headers });
  };
  getServicesLists = (packagesList: any[], delimiter: any) => {
    // const seperate = '+';
    return packagesList?.map((items) => items.name).join(delimiter);
  };
}

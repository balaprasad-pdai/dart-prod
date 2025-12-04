import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../util.service';

let headers: any;

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(private http: HttpClient, private util: UtilService) {
    headers = this.util.getHttpHeaders();
  }

  getCarModels = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/public/car-model', { headers });
  };
  getBrands = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/brands', { headers });
  };
  getServiceCategory = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/categories', { headers });
  };
  getAllPackages = (
    params: any = undefined,
    type : string = 'mechanical-repairs'
    ): Observable<any> => {
    this.util.activeUrl = 1;
    return params
      ? this.http.get<any>(`/api/package${params}&type=${type}`, { headers })
      : this.http.get<any>(`/api/package?type=${type}`, { headers });
  };
  getAllPackagesPrice = (): Observable<any> => {
    this.util.activeUrl = 1;
    return this.http.get<any>('/api/package-price', { headers });
  };
  getPackagePricesByQuery = (
    modelId: any,
    cityId: any,
    fuelType: any,
    
  ): Observable<any> => {
    this.util.activeUrl = 1;
    // return this.http.get<any>(
    //   `/api/package-price?modelId=${modelId}&cityId=${cityId}&fuelType=${fuelType}`,
    //   { headers }
    // );
    return this.http.get<any>(
      `/api/package-price?cityId=${cityId}`,
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
    return this.http.post<any>(`/api/order/${userId}/create`, params, {
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
  removeServiceFromCart = (
    serviceList: any,
    packageList: any[],
    userId: any,
    status: any
  ) => {
    const finalPackageList = packageList?.filter(
      (packageData: any) => packageData?.id !== serviceList?.id
    );
    const totalAmount = finalPackageList?.length
      ? finalPackageList
          ?.map(
            (pack: any) =>
              (pack?.slashedPrice ? pack.slashedPrice : 0) +
              (pack?.addons?.slashedPrice ? pack.addons.slashedPrice : 0)
          )
          .reduce((a: number, b: number) => a + b)
      : 0;
    const orderMeta = {
      package: finalPackageList,
      totalAmount,
    };
    return {
      orderMeta,
      paymentTotal: totalAmount,
      status,
      userId,
    };
  };
}

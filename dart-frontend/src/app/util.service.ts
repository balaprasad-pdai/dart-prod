import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';

// * Authentication Helper
class Authenticator {
  currentUser: string | null;
  token: string | null;
  constructor() {
    this.currentUser = localStorage.getItem('role')
      ? localStorage.getItem('role')
      : null;
    this.token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null;
  }

  loggedIn = (): boolean => (this.currentUser && this.token ? true : false);

  getHeaders(header: any = null) {
    const headers = header ? header : { 'Content-Type': 'application/json' };
    return headers;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private dataSubject = new Subject<number>();

  activeUrl = 0;
  masterData: any[] = [];
  appStatus: any[] = [];
  showAddressModal = false;
  showSpinnerData = true;
  showAboutUsModal = false;
  headerShowModal = 0;
  showLoginModal = false;
  showModelSelectModal = false;
  packageSearch = false;
  activeCartFetch = false;
  selectedFile: any[] = [];
  selectedFileUrl: any[] = [];
  fuels = [
    {
      name: 'Petrol',
      image: '../../assets/images/Fuel Type/PETROL.svg',
    },
    {
      name: 'Diesel',
      image: '../../assets/images/Fuel Type/DIESEL.svg',
    },
    {
      name: 'CNG',
      image: '../../assets/images/Fuel Type/CNG.svg',
    },
    {
      name: 'EV',
      image: '../../assets/images/Fuel Type/ELECTRIC.svg',
    },
    {
      name: 'HYBRID',
      image: '../../assets/images/Fuel Type/HYBRID.svg',
    },
    
  ];
  constructor(private http: HttpClient, private router: Router) {}
  readonly authHandler = (): Authenticator => new Authenticator();

  data$ = this.dataSubject.asObservable();

  // Service message commands
  updateData(data: number) {
    this.dataSubject.next(data);
  }

  readonly getHttpHeaders = (headers: any = null): any => {
    const header = this.authHandler().getHeaders();
    return { ...header, ...(headers !== null && { headers }) };
  };

  /**
   * @param data object which needs to be converted
   * @param isJSON a boolean flag to figure out wether the
   *  data should be parsed or stringified.
   */
  readonly analyze = (data: any, isJSON = true) => {
    if (data?.response) {
      const { response } = data;
      return isJSON ? JSON.parse(response) : JSON.stringify(response);
    }
    return isJSON ? JSON.parse(data) : JSON.stringify(data);
  };

  readonly navigateToUrl = (url: string, commonDataObject: any = undefined) => {
    if (commonDataObject) {
      sessionStorage.setItem('commonDetails', JSON.stringify(commonDataObject));
    }
    this.router.navigate([url]);
  };

  readonly clearCommonDetails = () => {
    sessionStorage.removeItem('commonDetails');
  };

  getMasterData = (): Observable<any> => {
    this.activeUrl = 1;
    const headers = this.getHttpHeaders();
    return this.http.get<any>('/api/master-data', { headers });
  };
  getAllUsers = (): Observable<any> => {
    this.activeUrl = 2;
    const headers = this.getHttpHeaders();
    return this.http.get<any>('/api/user', { headers });
  };
  getSingleUser = (userId: string): Observable<any> => {
    this.activeUrl = 2;
    const headers = this.getHttpHeaders();
    return this.http.get<any>(`/api/user/${userId}`, { headers });
  };
  addItems = (data: any, dataType: string) => {
    const localData = JSON.parse(localStorage.getItem(dataType) || '[]');
    localData.push(data);
    localStorage.setItem(dataType, JSON.stringify(localData));
  };
  getLocalItems = (dataType: string) => {
    const localData = localStorage.getItem(dataType);
    return localData ? JSON.parse(localData) : [];
  };

  getStates = (stateShortcode = null) => {
    const statesList: any[] = [];
    return stateShortcode
      ? statesList.filter((state) => state.shortCode === stateShortcode)
      : statesList;
  };

  readonly getBaseUrl = () => {
    return `${environment.coreService}/api/uploads/`;
  };
  updateUser = (params: any, userId: any): Observable<any> => {
    this.activeUrl = 2;
    const headers = this.getHttpHeaders();
    return this.http.put<any>(`/api/user/${userId}`, params, { headers });
  };
  readonly getOrderId = (orderId: any, length = 4) => {
    return `#DART${String(orderId).padStart(length, '0')}`;
  };
}

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(inputArray: any[], idProperty: string) {
    if (!inputArray || !Array.isArray(inputArray) || inputArray.length === 0) {
      return inputArray;
    }
    return inputArray
      .slice()
      .sort((a, b) => (a[idProperty] > b[idProperty] ? -1 : 1));
  }
}
@Pipe({ name: 'assend' })
export class AssendPipe implements PipeTransform {
  transform(inputArray: any[], idProperty: string) {
    if (!inputArray || !Array.isArray(inputArray) || inputArray.length === 0) {
      return inputArray;
    }
    return inputArray
      .slice()
      .sort((a, b) => (a[idProperty] < b[idProperty] ? -1 : 1));
  }
}

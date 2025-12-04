/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
// import { Orders } from "../category/data";
import { DecimalPipe } from '@angular/common';
// import { SortColumn, SortDirection } from "./city-sortable.directive";
import { HttpClient } from '@angular/common/http';
let headers: any;

interface SearchResult {
  filteredData: any[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  // sortColumn: SortColumn;
  // sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

// function sort(
//   filteredData: any[],
//   column: SortColumn,
//   direction: string
// ): any[] {
//   if (direction === "" || column === "") {
//     return filteredData;
//   } else {
//     return [...filteredData].sort((a, b) => {
//       const res = compare(a[column], b[column]);
//       return direction === "asc" ? res : -res;
//     });
//   }
// }

// function matches(country: any, term: string, pipe: ) {
//   return country.name.toLowerCase().includes(term.toLowerCase());
// }

@Injectable({ providedIn: 'root' })
export class ProfileAddressService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _filteredData$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    // sortColumn: "",
    // sortDirection: "",
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    payment: '',
    date: '',
  };
  cities = [
    {
      id: 1,
      name: 'Kannur',
      state: 'Kerala',
    },
    {
      id: 2,
      name: 'Kochi',
      state: 'Kerala',
    },
    {
      id: 3,
      name: 'Chalakudi',
      state: 'Kerala',
    },
  ];
  constructor(private pipe: DecimalPipe, private http: HttpClient) {}

  saveAddress = (param: any): Observable<any> => {
    /* const paramString = JSON.stringify(param); */
    return this.http.post<any>('/api/address', param, { headers });
  };
  getAddress = (userId: any): Observable<any> => {
    const params = userId ? `?userId=${userId}` : ``;
    return this.http.get<any>(`/api/address${params}`, { headers });
  };
  deleteAddress = (addressId: string): Observable<any> => {
    return this.http.delete<any>(`/api/address/${addressId}`, { headers });
  };
  getSelectedAddressDetail = (addressId: string): Observable<any> => {
    return this.http.get<any>(`/api/address/${addressId}`, { headers });
  };

  updateAddressDetail = (param: any, addressId: string): Observable<any> => {
    // const paramString = JSON.stringify(param);
    return this.http.patch<any>(`/api/address/${addressId}`, param, {
      headers,
    });
  };
}

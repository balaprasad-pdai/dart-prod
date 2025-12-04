/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
// import { SortColumn, SortDirection } from './blogs-list-sortable.directive';
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

@Injectable({ providedIn: 'root' })
export class BlogsService {
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

  constructor(private http: HttpClient) {}

  saveBlogsList = (param: any): Observable<any> => {
    /* const paramString = JSON.stringify(param); */
    return this.http.post<any>('/api/blog-content', param, { headers });
  };

  getBlogsList = (): Observable<any> => {
    return this.http.get<any>('/api/blog-content', { headers });
  };

  getSelectedBlogsList = (Id: string): Observable<any> => {
    return this.http.get<any>(`/api/blog-content/${Id}`, { headers });
  };

  getBlogCategory = (): Observable<any> => {
    return this.http.get<any>('/api/blog-category', { headers });
  };
}

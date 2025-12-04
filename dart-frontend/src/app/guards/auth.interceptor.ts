import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../util.service';
/* development environment */
import { environment } from '../../environments/environment';
/* development environment */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  urlPath!: string;
  constructor(private util: UtilService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.urlPath = this.getUrlPath(request);
    const Request = request.clone({
      url: this.urlPath,
      setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return next.handle(Request);
  }

  /** Helper function to switch url */
  getUrlPath = (data: any) => {
    const { coreService, cartService } = environment;
    const { url } = data;
    const base_url = this.util.activeUrl === 2 ? cartService : coreService;
    if (data.url.includes('project-fileuploads/projects')) {
      return url;
    }
    return `${base_url}${url}`;
  };
}

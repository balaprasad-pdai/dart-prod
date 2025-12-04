import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/header/login-service';
import { OrderService } from '../order-service';
import { UtilService } from '../../util.service';

@Component({
  selector: 'app-bookings-history-detail',
  templateUrl: './bookings-history-detail.component.html',
  styleUrls: ['./bookings-history-detail.component.css'],
})
export class BookingsHistoryDetailComponent {
  orderDetailList: any;
  constructor(
    private router: Router,
    public orderService: OrderService,
    public loginService: LoginService,
    public util: UtilService
  ) {}
  ngOnInit(): void {
    this.orderDetailList = sessionStorage.getItem('orderDetail')
      ? JSON.parse(sessionStorage.getItem('orderDetail') || '{}')
      : {};
  }
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };
}

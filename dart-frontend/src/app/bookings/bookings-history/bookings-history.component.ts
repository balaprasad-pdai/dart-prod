import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../header/login-service';
import { OrderService } from '../order-service';
import { UtilService } from '../../util.service';

@Component({
  selector: 'app-bookings-history',
  templateUrl: './bookings-history.component.html',
  styleUrls: ['./bookings-history.component.css'],
})
export class BookingsHistoryComponent {
  orderList: any[] = [];
  orderSortList: any[] = [];
  count = 1;
  sortData = 'recent';
  constructor(
    private router: Router,
    public orderService: OrderService,
    public loginService: LoginService,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadOrderServiceList();
  }
  sortBookingList = () => {
    if (this.sortData === 'car_name') {
      this.orderList = [];
      this.orderList = this.orderSortList.sort((a: any, b: any) => {
        const valueA = a.orderMeta?.vehicleData?.name
          ? a.orderMeta.vehicleData.name
          : '';
        const valueB = b.orderMeta?.vehicleData?.name
          ? b.orderMeta.vehicleData.name
          : '';
        if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        } else {
          return 0;
        }
      });

      return;
    }
    if (this.sortData === 'recent') {
      this.orderList = this.orderSortList;
    }
  };
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };
  loadOrderServiceList = async () => {
    const userId = localStorage.getItem('customerId');
    try {
      const orderServiceListReponse = await this.orderService
        .getAllOrderDetails(userId)
        .toPromise();
      if (orderServiceListReponse?.length) {
        this.orderList = orderServiceListReponse;
        this.orderSortList = orderServiceListReponse;
      }
    } catch (error) {}
  };
  bookingDetailList = (orderList: any) => {
    sessionStorage.setItem('orderDetail', JSON.stringify(orderList));
    this.navigateToUrl('bookings/history-details');
  };
  loadMoreList = () => {
    this.count++;
  };
}

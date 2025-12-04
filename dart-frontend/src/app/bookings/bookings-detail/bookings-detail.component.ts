import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from '../bookings-service';
import { OrderService } from '../order-service';

@Component({
  selector: 'app-bookings-detail',
  templateUrl: './bookings-detail.component.html',
  styleUrls: ['./bookings-detail.component.css'],
})
export class BookingsDetailComponent {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  slots = [
    {value: '10-11', time: '10 am - 11 am'},
    {value: '11-12', time: '11 am - 12 pm'},
    {value: '12-13', time: '12 pm - 01 pm'},
    {value: '13-14', time: '01 pm - 02 pm'},
    {value: '14-15', time: '02 pm - 03 pm'},
    {value: '15-16', time: '03 pm - 04 pm'},
  ];
  currYear!: any;
  currMonth!: any;
  date!: any;
  selectedSlot!: string;
  selectedDate!: any;
  addressList: any[] = [];
  orderComplete = false;
  activeCartList: any;
  orderParamsList: any;
  fromInsurance = false;
  brandsList: any;
  allModelList: any;
  filteredModelList : any;
  fuelList = [];
  selBrand = '';
  selModel = '';
  selFuel = '';
  
  constructor(
    private router: Router,
    private bookingService: BookingsService,
    public orderService: OrderService
  ) {}
  ngOnInit() {
    this.currYear = new Date().getFullYear();
    this.currMonth = new Date().getMonth();
    this.selectedDate = new Date();
    this.renderCalendar();
    this.loadActiveCartList();
    // const insuranceList = JSON.parse(sessionStorage.getItem('insuranceList') || '')
    if(sessionStorage.getItem('selectedInsurance')){
      this.fromInsurance = true;
    }
    this.loadBrands();
    this.loadCarModels();
  }
  
  loadBrands = () => {
    this.bookingService.getBrands().subscribe(
      (data: any) => {
        this.brandsList = data;
      }
    )
  }

  loadCarModels() {
    this.bookingService.getCarModels().subscribe(
      (data: any) => {
        this.allModelList = data;
      }
    )
  }

  onBrandChange(){
    this.filteredModelList = this.allModelList.filter((a:any) => a.brandId == this.selBrand);
  }

  onModelChange(){
    this.fuelList = this.filteredModelList.find((f: any) => f.id == this.selModel).fuelType;
    sessionStorage.setItem('modelId', this.selModel)
  }

  onFuelChange(){
    sessionStorage.setItem('fuelType', this.selFuel);
  }

  
  loadActiveCartList = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      try {
        const activeCartResponse = await this.bookingService
          .getActiveCartService(userId)
          .toPromise();
        if (activeCartResponse) {
          this.activeCartList = activeCartResponse;
          const { orderMeta, paymentTotal, id } = activeCartResponse;
          orderMeta.selectedDate = this.selectedDate ? this.selectedDate : null;
          this.orderParamsList = {
            orderMeta,
            paymentTotal,
            id,
          };
        }
      } catch (error) {}
    }
  };
  getServiceDay = (event: any) => {
    if (!event.target.className.includes('disabled')) {
      this.selectedDate = new Date(
        this.currYear,
        this.currMonth,
        event.target.textContent
      );
      const daysTag = document.querySelector('.days') as HTMLAreaElement;
      const children = daysTag.children as HTMLCollection;
      for (let i = 0; i < children.length; i++) {
        if (children[i].className.includes(' active')) {
          children[i].className = children[i].className.replace(' active', '');
        }
      }
      const { orderMeta } = this.orderParamsList;
      orderMeta.selectedDate = this.selectedDate;
      event.target.className = event.target.className
        ? event.target.className.includes(' active')
          ? event.target.className.replaceAll(' active', '')
          : `${event.target.className} active`
        : ' active';
    }
  };
  getServiceSlot = (event: any, val: any) => {
    this.selectedSlot = event.target.innerText;
    const { orderMeta } = this.orderParamsList;
    orderMeta.selectedSlot = this.selectedSlot;
    orderMeta.selTimeVal = val;
  };
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };
  prevMonth = () => {
    this.currMonth = this.currMonth - 1;

    if (this.currMonth < 0 || this.currMonth > 11) {
      this.currYear = this.currYear - 1;
      this.currMonth = this.currMonth < 0 ? 11 : 0;
    }

    this.renderCalendar();
  };
  nextMonth = () => {
    this.currMonth = this.currMonth + 1;
    if (this.currMonth < 0 || this.currMonth > 11) {
      this.currYear = this.currYear + 1;
      this.currMonth = this.currMonth < 0 ? 11 : 0;
    }

    this.renderCalendar();
  };
  prevNextMonths = () => {
    const prevNextIcon = document.querySelectorAll('.icons span');
    prevNextIcon.forEach((icon) => {
      icon.addEventListener('click', () => {
        this.currMonth =
          icon.id === 'prev' ? this.currMonth - 1 : this.currMonth + 1;

        if (this.currMonth < 0 || this.currMonth > 11) {
          this.currYear =
            icon.id === 'prev' ? this.currYear - 1 : this.currYear + 1;
          this.currMonth = this.currMonth < 0 ? 11 : 0;
        }

        this.renderCalendar();
      });
    });
  };
  renderCalendar = () => {
    this.date = new Date(this.currYear, this.currMonth, 1);
    const daysTag = document.querySelector('.days') as HTMLAreaElement;
    const currentDate = document.querySelector(
      '.current-date'
    ) as HTMLAreaElement;
    let firstDayofMonth = this.date.getDay();
    let lastDateofMonth = new Date(
      this.currYear,
      this.currMonth + 1,
      0
    ).getDate();
    let lastDayofMonth = new Date(
      this.currYear,
      this.currMonth,
      lastDateofMonth
    ).getDay();
    let lastDateofLastMonth = new Date(
      this.currYear,
      this.currMonth,
      0
    ).getDate();
    let liTag = '';

    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const currentDateTime = new Date();
      const currentTime = currentDateTime.getTime();
      const dateValue = new Date(`${this.currYear}-${this.currMonth + 1}-${i}`);
      const dateTimeValue = dateValue.getTime();
      const selectedDateArray = this.selectedDate
        ? {
            date: new Date(this.selectedDate).getDate(),
            month: new Date(this.selectedDate).getMonth(),
            year: new Date(this.selectedDate).getFullYear(),
          }
        : {
            date: currentDateTime.getDate(),
            month: currentDateTime.getMonth(),
            year: currentDateTime.getFullYear(),
          };
      let isToday =
        i === selectedDateArray.date &&
        this.currMonth === selectedDateArray.month &&
        this.currYear === selectedDateArray.year
          ? 'selectableday active'
          : currentTime > dateTimeValue
          ? 'inactive disabled'
          : 'selectableday';

      liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${this.months[this.currMonth]} ${this.currYear}`;
    daysTag.innerHTML = liTag;
  };
  addressSelection = (address: any) => {
    const { orderMeta } = this.orderParamsList;
    orderMeta.address = address;
  };
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from '../bookings-service';
import { OrderService } from '../order-service';
import { ToastrService } from 'ngx-toastr';
import { HomePagesService } from 'src/app/home-pages/home-pages-service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/profile-pages/profile/profile.service';
import { UtilService } from 'src/app/util.service';
declare let window: any;
@Component({
  selector: 'app-selected-packages',
  templateUrl: './selected-packages.component.html',
  styleUrls: ['./selected-packages.component.css'],
})
export class SelectedPackagesComponent implements OnInit {
  servicesList: any[] = [];

  servicesListFiltered: any[] = [];
  packagePrice: any[] = [];
  packageId: any;
  modelId: any;
  cityId: any;
  fuelType: any;
  selectedPackagePriceList: any[] = [];
  filteredPackageList: any[] = [];
  showDropdown = 0;
  selectedCarModel = ' Select Car model';
  selectedService = { name: 'Select Service' };
  modelSearchTerm: string = '';
  carsFiltered: any[] = [];
  modelsList: any[] = [];
  car: any;
  service: any[] = [];
  getBrands: any;
  selectedPanelList: any[] = [];
  addOnList: any[] = [];
  filteredAddonList: any[] = [];
  serviceSearchTerm: string = '';
  typeOfWorkList: any[] = [];
  displayAddOns = 'none';
  display = 'none';
  showModal = false;
  gradeList: any[] = [];
  selectedPackageList: any = { addons: null };
  paymentError = false;
  paymentMethodList = [
    'Credit Card',
    'Debit Card',
    'Net Banking',
    'UPI',
    'Cash on Delivery',
  ];
  images: any[] = [];
  uploadedImages: any[] = []
  @Input() activeCartList: any;
  @Input() page!: string;
  @Input() orderParams: any;
  @Input() packageCloseBtn: boolean = false;
  @Input() fromInsurance: boolean = false;
  @Input() insuranceList: any = [];
  @Output() buttonClicked = new EventEmitter<boolean>();
  selectedPanel!: any;
  clicked = false;
  modalVehicle!: any;
  vehicleForm!: UntypedFormGroup;
  selecetdInsurance = '';
  insuranseProviderList = [
    { id: 1, name: 'HDFC Ergo', link: 'HDFC-Ergo.pdf' },
    { id: 2, name: 'Iffco Tokio', link: 'Iffco-Tokio.pdf' },
    { id: 3, name: 'Acko', link: 'Acko.pdf' },
    { id: 4, name: 'Liberty', link: 'Liberty.pdf' },
    { id: 5, name: 'Universal Sompo', link: 'Universal-Sompo.pdf' },
    { id: 6, name: 'Tata AIG', link: 'Tata-AIG.pdf' },
    { id: 7, name: 'Bharti AXA', link: 'Bharti-AXA.pdf' },
    { id: 8, name: 'ICICI Lombard', link: 'ICICI-Lombard.pdf' },
    { id: 9, name: 'Bajaj Allianz', link: 'Bajaj-Allianz.pdf' },
    { id: 10, name: 'Royal Sundaram', link: 'Royal-Sundaram.pdf' },
    { id: 11, name: 'Chola MS', link: 'Chola-MS.pdf' },
    { id: 12, name: 'Future Generali', link: 'Future-Generali.pdf' },
    { id: 13, name: 'Kotak', link: 'Kotak.pdf' },
    { id: 14, name: 'Magma HDI', link: 'Magma-HDI.pdf' },
    { id: 15, name: 'Oriental Insurance', link: 'Oriental-Insurance.pdf' },
    { id: 16, name: 'L&T Insurance', link: 'L-T-Insurance.pdf' },
    { id: 17, name: 'Shriram General Insurance', link: 'Shriram-General-Insurance.pdf'},
    { id: 18, name: 'Reliance General', link: 'Reliance-General.pdf' },
    { id: 19, name: 'United India', link: 'United-India.pdf' },
    { id: 20, name: 'New India Assurance', link: 'New-India-Assurance.xls' },
  ];
  constructor(
    public router: Router,
    private bookingService: BookingsService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private homeService: HomePagesService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.packageId = sessionStorage.getItem('packageId');
    this.modelId = sessionStorage.getItem('modelId');
    this.cityId = localStorage.getItem('cityId');
    this.fuelType = sessionStorage.getItem('fuelType');
    this.getActiveCartData();
    this.loadData();
    // this.insuranceList = JSON.parse(sessionStorage.getItem('insuranceList') || '')
    // console.log('this.insuranceList--', this.insuranceList);
    // if(this.insuranceList.length){
    //   this.fromInsurance = true;
    // }
    if(sessionStorage.getItem('selectedInsurance')){
      this.fromInsurance = true;
      this.selecetdInsurance = sessionStorage.getItem('selectedInsurance')!;
    }
    if(sessionStorage.getItem('images')){
      this.uploadedImages = JSON.parse(sessionStorage.getItem('images')!);
    }
    

    this.vehicleForm = this.formBuilder.group({
      vehicleNumber: [
        '',
        [Validators.required, Validators.pattern('^(?! )[0-9A-Z- ]{8,}$')],
      ],
      chasisNumber: [
        '',
        [Validators.required, Validators.pattern('^(?! )[0-9A-Z- ]{8,}$')],
      ],
    });
    // this.getSelectedPackages();
  }
  navigateToUrl = (url: any) => {
    // localStorage.setItem('fromInsurance', JSON.stringify(this.fromInsurance));
    this.router.navigate([url]);
  };
  getSelectedPackages = async () => {
    try {
      const selectedPackagesPrice = await this.bookingService
        .getPackagePricesByQuery(this.modelId, this.cityId, this.fuelType)
        .toPromise();
      if (selectedPackagesPrice) {
        this.selectedPackagePriceList = selectedPackagesPrice;
      } else {
      }
    } catch (error) {}
  };
  closeModal = () => {
    this.showModal = false;
    this.displayAddOns = 'none';
    this.display = 'none';
  };

  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };

  selectModel = (car: any) => {
    this.selectedCarModel = `${car.brand?.name} ${car.name}`;
    sessionStorage.setItem('modelId', car.id);
    this.showDropdown = 0;
  };
  selectService = (service: any) => {
    this.selectedService = service;
    sessionStorage.setItem('packageId', service.id);
    this.showDropdown = 0;
  };
  matches = (data: any, searchTerm: string) => {
    return data.name?.toLowerCase().includes(searchTerm.toLowerCase());
  };
  searchModel = (event: any) => {
    this.carsFiltered = this.modelsList.filter((service) =>
      this.matches(service, event)
    );
  };
  searchService = (event: any) => {
    this.servicesListFiltered = this.servicesList.filter((service) =>
      this.matches(service, event)
    );
  };
  dropdownHideAndShow = (showValue: number) => {
    if (this.showDropdown == showValue) {
      this.showDropdown = 0;
    } else {
      this.showDropdown = showValue;
    }
  };
  loadData = async () => {
    try {
      this.getAddOnList();
      // const loadBrandResponse = await this.bookingService
      //   .getBrands()
      //   .toPromise();
      // if (loadBrandResponse) {
      //   this.brandsList = loadBrandResponse;
      // }
      const loadModelResponse = await this.bookingService
        .getCarModels()
        .toPromise();
      if (loadModelResponse) {
        this.modelsList = loadModelResponse;
        this.carsFiltered = this.modelsList;
        if (this.modelId) {
          const selectedCarModel = loadModelResponse.filter(
            (service: any) => service.id === Number(this.modelId)
          );
          this.selectedCarModel = selectedCarModel.length
            ? `${selectedCarModel[0]?.brand?.name} ${selectedCarModel[0]?.name}`
            : '';
        }
      }
      const serviceResponse = await this.bookingService
        .getServiceCategory()
        .toPromise();
      if (serviceResponse) {
        this.servicesList = serviceResponse;

        this.servicesListFiltered = this.servicesList;
        if (this.packageId) {
          const selectedService = serviceResponse.filter(
            (service: any) => service.id === Number(this.packageId)
          );
          this.selectedService = selectedService.length
            ? selectedService[0]
            : null;
        }
      }
    } catch (error) {}
  };
  getActiveCartData = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      try {
        const responseActiveCartList = await this.bookingService
          .getActiveCartService(userId)
          .toPromise();
        if (responseActiveCartList?.id) {
          this.activeCartList = responseActiveCartList;
        }
      } catch (error) {}
    }
  };
  calculatePercentage = (packagePriceList: any) => {
    const percentage =
      packagePriceList?.slashedPrice &&
      packagePriceList?.price &&
      packagePriceList.price > packagePriceList.slashedPrice
        ? Math.round(
            ((packagePriceList.price - packagePriceList.slashedPrice) /
              packagePriceList.price) *
              10000
          ) / 100
        : null;
    return percentage ? `${percentage} % off` : '';
  };
  calculatePercentageBy2Numbers = (price: any, slashedPrice: any) => {
    const percentage =
      slashedPrice && price && price > slashedPrice
        ? Math.round(((price - slashedPrice) / price) * 10000) / 100
        : null;
    return percentage ? `${percentage} % off` : '';
  };
  getActiveService = () => {
    const selectedService = sessionStorage.getItem('packageId');
    const activeService = this.servicesListFiltered?.filter(
      (service) => service.id === Number(selectedService)
    );
    return activeService.length ? activeService[0].name : '';
  };
  getAddOnList = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      const params = {};
      try {
        const gradeListResponse = await this.bookingService
          .getAddOnList()
          .toPromise();
        if (gradeListResponse?.length) {
          this.gradeList = gradeListResponse;
        }
      } catch (error) {}
    }
  };
  getPackageWorksTypes = (partsTypeOfWorkId: any) => {
    const selectedTypeOfWork = this.typeOfWorkList?.filter(
      (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
    );
    return selectedTypeOfWork?.length ? selectedTypeOfWork[0].name : '';
  };
  calculateGST = (paymentTotal: any) => {
    const gstAmount = Number(paymentTotal) * 0.18;
    return Math.round(gstAmount * 100) / 100;
  };
  parseInt = (paymentTotal: any) => {
    return Number(paymentTotal);
  };
  get form() {
    return this.vehicleForm.controls;
  }
  validationAndCheckout = async () => {
    if (this.vehicleForm.valid) {
      this.modalVehicle.hide();
      this.orderParams.orderMeta.vehicleNumber =
        this.form['vehicleNumber'].value;
      this.orderParams.orderMeta.chasisNumber = this.form['chasisNumber'].value;
      this.orderParams.vehicleNumber = this.form['vehicleNumber'].value;
      this.orderParams.chasisNumber = this.form['chasisNumber'].value;
      this.checkout();
    } else if (!this.form['vehicleNumber'].valid) {
      this.toastr.error('Enter a valid Vehicle Number');
    } else if (!this.form['chasisNumber'].valid) {
      this.toastr.error('Enter a valid Chassis Number');
    } else if (
      !this.form['chasisNumber'].valid &&
      !this.form['vehicleNumber'].valid
    ) {
      this.toastr.error('Enter valid Vehicle and Chassis numbers');
    }
  };
  checkout = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    let params: any;
    if (loggedIn) {
      const vehicleModel = sessionStorage.getItem('modelId');
      const getActiveVehicleList = await this.homeService
        .getCarModels(vehicleModel, 'id')
        .toPromise();
      const vehicleData = getActiveVehicleList?.length
        ? {
            id: getActiveVehicleList[0]?.id,
            name: `${getActiveVehicleList[0]?.brand?.name} ${getActiveVehicleList[0]?.name}`,
            logoUrl: getActiveVehicleList[0]?.sizedPhoto,
            brandId: getActiveVehicleList[0]?.brand?.id,
            vehicleVarient: sessionStorage.getItem('fuelType'),
          }
        : null;

      const userId = localStorage.getItem('customerId');
      const updationTime = new Date().toISOString();
      const timeline = [
        {
          title: 'Order processed',
          updationTime,
        },
      ];
      const selectedFiles = this.packageCloseBtn
        ? JSON.parse(sessionStorage.getItem('estimate') || '[]')
        : null;

      const {
        orderMeta,
        paymentTotal,
        id: cartId,
        chasisNumber,
        vehicleNumber,
      } = this.orderParams;
      orderMeta.freeEstimate = selectedFiles;
      orderMeta.vehicleData = vehicleData ? vehicleData : null;
      orderMeta.selecetdInsurance = this.selecetdInsurance;
      if (!orderMeta.address && !this.packageCloseBtn) {
        this.toastr.error('Please select Address');
        return;
      }
      if (!orderMeta.selectedDate && !this.packageCloseBtn) {
        this.toastr.error('Please select pickup date');
        return;
      }
      if (!orderMeta.selectedSlot && !this.packageCloseBtn) {
        this.toastr.error('Please select pickup time');
        return;
      }
      if (!orderMeta.preferredPaymentMethod && !this.packageCloseBtn) {
        this.paymentError = true;
        this.toastr.error('Please select preferred payment method');
        return;
      }
      const paymentWithGST =
        Number(paymentTotal) + this.calculateGST(paymentTotal);
      orderMeta.gstAmount = this.calculateGST(paymentTotal);
      params = {
        orderMeta,
        paymentTotal: paymentWithGST,
        status: 'awaiting-confirmation',
        cartId,
        timeline,
        vehicleNumber,
        chasisNumber,
      };
      if(sessionStorage.getItem('selectedInsurance')){
        params.insuranceCompany = sessionStorage.getItem('selectedInsurance');
      }
      if(sessionStorage.getItem('images')){
        params.images = JSON.parse(sessionStorage.getItem('images')!);
      }
      try {
        const response = await this.bookingService
          .createOrderService(userId, params)
          .toPromise();
        sessionStorage.removeItem('selectedInsurance');
        sessionStorage.removeItem('images');
        // if (response && !this.packageCloseBtn) {
        //   localStorage.setItem('orderDetails', JSON.stringify(response));
        //   this.orderService.orderComplete = true;
        //   this.navigateToUrl('/bookings');
        // } else {
        //   this.navigateToUrl('/free-estimate');
        // }
        if (response) {
          localStorage.setItem('orderDetails', JSON.stringify(response));
          this.orderService.orderComplete = true;
          if(params.insuranceCompany){
            this.navigateToUrl('/body-and-paint-repair');
          } else {
            this.navigateToUrl('/bookings');
          }
        }
      } catch (error) {}
    }
  };
  calculateTotal = (amount: any) => {
    const gstAmount = this.calculateGST(amount);
    const finalAmount = Number(amount) + gstAmount;
    return Math.round(finalAmount * 100) / 100;
  };
  removeServiceFromCartList = (serviceList: any) => {
    const { orderMeta: orderMetaList, userId, status } = this.activeCartList;
    const { package: packageList } = orderMetaList;
    const params = this.bookingService.removeServiceFromCart(
      serviceList,
      packageList,
      userId,
      status
    );
    this.addOrUpdateToCart(userId, params);
  };
  addOrUpdateToCart = async (userId: any, params: any) => {
    try {
      const addToCart = await this.bookingService
        .addToCartService(userId, params)
        .toPromise();
      if (addToCart?.id) {
        this.activeCartList = addToCart;
        if (addToCart?.orderMeta?.package?.length) {
          sessionStorage.setItem('cart', 'true');
        } else {
          sessionStorage.setItem('cart', 'false');
        }
        this.buttonClicked.emit(true);
      }
    } catch (error) {}
  };
  paymentMethodChange = (preferredPaymentMethod: string = '') => {
    const { orderMeta } = this.orderParams;
    orderMeta.preferredPaymentMethod =
      preferredPaymentMethod !== '' ? preferredPaymentMethod : null;
    this.paymentError = false;
  };
  checkForVehicleInfo = () => {
    if (
      this.orderParams?.vehicleNumber &&
      this.orderParams?.chasisNumber &&
      this.orderParams?.orderMeta?.vehicleNumber &&
      this.orderParams?.orderMeta?.chasisNumber
    ) {
      this.checkout();
    } else {
      if (this.modalVehicle) {
        this.modalVehicle.dispose();
      }
      this.modalVehicle = new window.bootstrap.Modal(
        document.getElementById('ModalVehicle')
      );
      this.modalVehicle.show();
    }
  };
  addVehicleData = () => {};

  checkoutNew = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    let params: any;
    if (loggedIn) {
      const vehicleModel = sessionStorage.getItem('modelId');
      console.log('vehicleModel', vehicleModel, 'type', sessionStorage.getItem('fuelType'));
      let vehicleData: any = '';
      if(!vehicleModel){
        this.toastr.error('Please add Vehicle Details');
        return;
      }
      if(!sessionStorage.getItem('fuelType')){
        this.toastr.error('Please add fuel type');
        return;
      }
      if(vehicleModel){
        const getActiveVehicleList = await this.homeService
          .getCarModels(vehicleModel, 'id')
          .toPromise();
        vehicleData = getActiveVehicleList?.length
          ? {
              id: getActiveVehicleList[0]?.id,
              name: `${getActiveVehicleList[0]?.brand?.name} ${getActiveVehicleList[0]?.name}`,
              logoUrl: getActiveVehicleList[0]?.sizedPhoto,
              brandId: getActiveVehicleList[0]?.brand?.id,
              vehicleVarient: sessionStorage.getItem('fuelType'),
            }
          : null;
      }
      console.log('vehicleData', vehicleData);
      const userId = localStorage.getItem('customerId');
      const updationTime = new Date().toISOString();
      const timeline = [
        {
          title: 'Order processed',
          updationTime,
        },
      ];
      const selectedFiles = this.packageCloseBtn
        ? JSON.parse(sessionStorage.getItem('estimate') || '[]')
        : null;

      const {
        orderMeta,
        paymentTotal,
        id: cartId,
        chasisNumber,
        vehicleNumber,
      } = this.orderParams;
      orderMeta.freeEstimate = selectedFiles;
      orderMeta.vehicleData = vehicleData ? vehicleData : null;
      if (!orderMeta.address && !this.packageCloseBtn) {
        this.toastr.error('Please select Address');
        return;
      }
      if (!orderMeta.selectedDate && !this.packageCloseBtn) {
        this.toastr.error('Please select pickup date');
        return;
      }
     
      if (!orderMeta.selectedSlot && !this.packageCloseBtn) {
        this.toastr.error('Please select pickup time');
        return;
      }
      if(orderMeta.selectedSlot){
        var time = new Date();
        console.log(
          time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        );
        if( new Date().getDate() == new Date(orderMeta.selectedDate).getDate()){
          let time = new Date();
          let time1 = orderMeta.selTimeVal.split('-')[1];
          let time2 = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
          
          if (this.compareTimes(time1, time2)) {
            console.log(`${time1} is less than ${time2}`);
            this.toastr.error('Please select a future slot')
            return;
        } else {
            console.log(`${time1} is greater than or equal to ${time2}`);
        }
        }
      }
      // if (!orderMeta.preferredPaymentMethod && !this.packageCloseBtn) {
      //   this.paymentError = true;
      //   this.toastr.error('Please select preferred payment method');
      //   return;
      // }
      const paymentWithGST =
        Number(paymentTotal) + this.calculateGST(paymentTotal);
      orderMeta.gstAmount = this.calculateGST(paymentTotal);
      delete orderMeta.selTimeVal;
      params = {
        orderMeta,
        paymentTotal: paymentWithGST,
        status: 'awaiting-confirmation',
        cartId,
        timeline,
        vehicleNumber,
        chasisNumber,
      };
       if(sessionStorage.getItem('selectedInsurance')){
        params.insuranceCompany = sessionStorage.getItem('selectedInsurance');
      }
      if(sessionStorage.getItem('images')){
        params.images = JSON.parse(sessionStorage.getItem('images')!);
      }

      try {
        const response = await this.bookingService
          .createOrderService(userId, params)
          .toPromise();
        // if (response && !this.packageCloseBtn) {
        //   sessionStorage.removeItem('selectedInsurance');
        //   localStorage.setItem('orderDetails', JSON.stringify(response));
        //   this.orderService.orderComplete = true;
        //   this.navigateToUrl('/bookings');
        // } else {
        //   this.navigateToUrl('/free-estimate');
        // }
        if (response) {
          localStorage.setItem('orderDetails', JSON.stringify(response));
          this.orderService.orderComplete = true;
          sessionStorage.removeItem('selectedInsurance');
          sessionStorage.removeItem('images');
          sessionStorage.removeItem('fuelType');
          sessionStorage.removeItem('modelId');
          // if(params.insuranceCompany){
          //   this.navigateToUrl('/body-and-paint-repair');
          // } else {
            this.navigateToUrl('/bookings');
          // }
        }
      } catch (error) {
      }
    }
  };

  compareTimes(time1: string, time2: string): boolean {
    const time1InMinutes = this.parseTimeToMinutes(time1);
    const time2InMinutes = this.parseTimeToMinutes(time2);
    return time1InMinutes < time2InMinutes;
  }

  parseTimeToMinutes(time: string): number {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minutes = minuteStr ? parseInt(minuteStr, 10) : 0;
    return hour * 60 + minutes;
  }


  onInsuranceChange(selecetdInsurance: any){
    sessionStorage.setItem('selectedInsurance', selecetdInsurance)
  }

  onAccept(file: any) {
    const files = file.target.files;
    Object.keys(files).forEach((property: any) => {
      this.uploadFile(files[property]);
    });
  }

  uploadFile(file: any){
    this.utilService.showSpinnerData = true;
    const form = new FormData();
    form.append('file', file);
    this.profileService.uploadFile(form).subscribe(
      (res: any) => {
        if (res?.mediaId) {
          const uploadFilePath = this.utilService.getBaseUrl() + res.mediaId;
          this.images.push(uploadFilePath)
          sessionStorage.setItem('images', JSON.stringify(this.images));
          this.utilService.showSpinnerData = false;
        }
      },
      (error) => {}
    );
  }
}

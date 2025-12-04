import { Component, Input, DoCheck, HostListener, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../util.service';
import sal from 'sal.js';
import { LoginService } from './login-service';
import { HomePagesService } from '../home-pages/home-pages-service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BookingsService } from '../bookings/bookings-service';
import { Subscription } from 'rxjs';
declare let window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck, OnDestroy {
  loggedIn = false;
  showAuthWpr: boolean = false;
  phoneForm!: UntypedFormGroup;
  submitted = false;
  isCollapsed: boolean = true;
  /* showModal = 1; */

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: true,
    classList: {
      container: 'otp-container-ngx',
      input: 'otp-input-class',
      inputFilled: 'otp-txt',
    },
  };
  rightHidden = true;
  showLoginModal = 0;
  display = 'none';
  displayOtp = 'none';
  navLinks: any[] = [];
  modelSearchTerm: string = '';
  brandsList: any[] = [];
  brandFiltered: any[] = [];
  carsFiltered: any[] = [];
  selectedCity: string | null | undefined;
  selectedCar!: any;
  selectCar: string = '';
  selectedFuel = '';
  cityId = '';
  fuelType = '';
  modelId = '';

  cities: any[] = [];

  citiesList: any[] = [];

  cars: any[] = [];

  modalPhone!: any;
  modalOtp!: any;
  modalLoggedin!: any;
  modalCity!: any;
  modalManufacture!: any;
  modalCar!: any;
  modalFuel!: any;
  @Input() activeLink: any;
  modelsList: any[] = [];
  getScreenWidth!: any;
  smallScreen!: boolean;
  showSubmenu = false;
  cartPresent: boolean = false;
  servicesList = [
    {name: 'Car AC Service', id:"s-1", bgColor: '#d5f7ba', logoUrl: 'http://143.110.254.42:3333/api/uploads/1698438102478-382600356.svg'},
    {name: 'Full body painting', id:"s-2", bgColor: '#d5f7ba', logoUrl: 'http://143.110.254.42:3333/api/uploads/1698438102478-382600356.svg'},
    {name: 'Periodic Service', id:"s-3", bgColor: '#d5f7ba', logoUrl: 'http://143.110.254.42:3333/api/uploads/1698438102478-382600356.svg'},
    {name: 'Denting and Painting', id:"s-4", bgColor: '#d5f7ba', logoUrl: 'http://143.110.254.42:3333/api/uploads/1698438102478-382600356.svg'},
    {name: 'Tyre Replacement', id:"s-5", bgColor: '#d5f7ba', logoUrl: 'http://143.110.254.42:3333/api/uploads/1698438102478-382600356.svg'}
  ]
  filteredServicesList: any;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    // navText: [ '<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right></i>"' ],
    navText: ['<i class="fas fa-angle-left fa-2x"></i>', '<i class="fas fa-angle-right fa-2x"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 5,
      }
    }
  }
  showServices = false;
  subscription: Subscription;
  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    public headerService: LoginService,
    private homeService: HomePagesService,
    public utilService: UtilService,
    // private util: UtilService,
    private bookingService: BookingsService
  ) {
    this.subscription = headerService.loginAnnounced$.subscribe(
      mission => {
        this.login();
    });
  }

  ngDoCheck() {
    // Check the value of loggedIn in localStorage and update showAuthWpr accordingly
    const loggedIn = localStorage.getItem('loggedIn');
    this.headerService.showAuthWpr = loggedIn === 'true';
    const matchingCar = sessionStorage.getItem('selectedCar');
    this.selectedCar = matchingCar ? JSON.parse(matchingCar) : null;
    if (this.utilService.showModelSelectModal) {
      // this.carCheck();
    } else if (this.utilService.showLoginModal) {
      this.openModalShow('modalPhone');
      this.utilService.showLoginModal = false;
    }
    const cart = sessionStorage.getItem('cart');
    this.cartPresent = cart == 'true' ? true : false;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 1024) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }
  ngOnInit() {
    sal();
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 1024) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
    this.selectedCity = localStorage.getItem('cityName')
      ? localStorage.getItem('cityName')
      : '';
    // this.carsFiltered = this.cars;

    this.phoneForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^(?! )[0-9]{10}$')],
      ],
      otp: ['', [Validators.required]],
    });
    this.navLinks = [
      {
        name: 'Mechanical Repairs',
        link: 'bookings',
        icon: 'fa fa-coins',
        active: false,
      },
      {
        name: 'Body & Paint Repairs',
        link: 'body-and-paint-repair',
        icon: 'fa-solid fa-user-shield',
        active: false,
      },
      {
        name: 'Value Added Services',
        link: 'bookings',
        icon: 'fa-solid fa-user-shield',
        active: false,
      },
      // { name: 'Blogs', link: 'blogs', icon: 'fa-solid fa-blog', active: false },
      /* { name: 'Gallery', link: '', active: false }, */
      {
        name: 'Free Estimate',
        link: 'free-estimate',
        icon: 'fa-solid fa-clipboard-question',
        active: false,
      },
      // {
      //   name: 'About Us',
      //   link: 'about-us/details',
      //   icon: 'fa-solid fa-clipboard-question',
      //   active: false,
      // },
    ];

    this.loadData();
    this.loadServicesData();
  }
  get getPhoneForm() {
    return this.phoneForm.controls;
  }
  handleOtpChange(event: any) {}
  handleFillEvent(event: any) {
    const otpNo = event;
    this.phoneForm.patchValue({
      otp: otpNo,
    });
  }
  navigateToUrl = (url: any, nav?: any) => {
    // this.router.navigate([url]);
    if(url=='bookings'){
      if(nav.name == 'Value Added Services'){
        // this.filtered = this.ser
        this.filteredServicesList = this.servicesList.filter((s: any) => {
          return (s.name.indexOf('Exterior Detailing') != -1 || s.name.indexOf('Interior Detailing') != -1 || (s.name.indexOf('Paint Protection') != -1))
        })
      } else {
        this.filteredServicesList = this.servicesList;
        this.filteredServicesList = this.servicesList.filter((s: any) => {
          return (s.name.indexOf('Exterior Detailing') == -1 && s.name.indexOf('Interior Detailing') == -1 && (s.name.indexOf('Paint Protection') == -1))
        })
      }
      this.showServices = !this.showServices;
    } else {
      this.router.navigate([url]);
    }
  };
  checkCartAndnavigateToUrl = (url: any) => {
    if (this.cartPresent) {
      this.router.navigate([url]);
    } else {
      this.toastr.error('Your cart is empty');
    }
  };
  getFuelType = (type: any) => {
    let carModel = sessionStorage.getItem('selectedCar');
    const fuelTypes = carModel ? JSON.parse(carModel)?.fuelType : [];
    const fuelTypesFiltered = fuelTypes.filter(
      (fuelType: any) => fuelType == type
    );
    return fuelTypesFiltered?.length ? true : false;
  };
  loadData = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const loadCityResponse = await this.headerService
        .getCityNames()
        .toPromise();

      if (loadCityResponse?.length) {
        this.citiesList = loadCityResponse?.filter(
          (city: any) => city.status === 'active'
        );
        if (!this.citiesList?.length) {
          this.utilService.showSpinnerData = false;
          return;
        }
        if (this.citiesList?.length === 1) {
          localStorage.setItem('cityId', this.citiesList[0].id);
          localStorage.setItem('cityName', this.citiesList[0].name);
          this.selectedCity = this.citiesList[0].name;
          this.utilService.showSpinnerData = false;
        }
      }
      const loadCarBrands = await this.homeService.getBrands().toPromise();
      this.brandsList = loadCarBrands?.length ? loadCarBrands : [];
      this.brandFiltered = loadCarBrands?.length ? loadCarBrands : [];

      if (
        this.activeLink == '' ||
        this.activeLink == 'Services' ||
        this.activeLink == 'Free Estimate'
      ) {
        // this.carCheck();
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };
  loadCarModel = async (brandId: any = undefined) => {
    const loadModelResponse = await this.homeService
      .getCarModels(brandId, 'brandId')
      .toPromise();
    if (loadModelResponse) {
      this.modelsList = loadModelResponse.filter(
        (car: any) => car.status === 'active'
      );
      this.carsFiltered = loadModelResponse.filter(
        (car: any) => car.status === 'active'
      );
      this.utilService.showSpinnerData = false;
    }
  };
  carCheck = async (carModelResponse: any = undefined) => {
    const cityId = localStorage.getItem('cityId');
    const brandId = sessionStorage.getItem('brandId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');

    if (cityId && fuelType && modelId && brandId) {
      // this.display = 'none';
      // this.headerService.showModal = 0;
      this.utilService.showSpinnerData = false;
    } else {
      if (!cityId) {
        // this.headerService.showModal = 1;
        this.openModalShow('modalCity');
        this.utilService.showModelSelectModal = false;
      } else if (!brandId) {
        sessionStorage.removeItem('modelId');
        sessionStorage.removeItem('fuelType');
        // this.headerService.showModal = 2;
        this.openModalShow('modalManufacture');
        this.utilService.showModelSelectModal = false;
      } else if (!modelId) {
        if (!carModelResponse) {
          this.loadCarModel(brandId);
        } else {
          sessionStorage.removeItem('modelId');
          this.openModalShow('modalCar');
          this.utilService.showModelSelectModal = false;
        }

        // this.headerService.showModal = 3;
      } else if (!fuelType) {
        // this.headerService.showModal = 4;
        this.openModalShow('modalFuel');
        this.utilService.showModelSelectModal = false;
      }
      // Display only the respective modal for each empty key
      // this.display = 'flex';
    }
    if (this.utilService.showLoginModal) {
      this.openModalShow('modalPhone');
      this.utilService.showLoginModal = false;
    }
  };

  generateOtp = async () => {
    this.submitted = true;

    if (this.getPhoneForm['username'].value) {
      if (this.getPhoneForm['username'].valid) {
        const params = {
          username: '+91' + this.getPhoneForm['username'].value,
        };

        const otpResponse = await this.headerService.getOtp(params).toPromise();
        if (otpResponse) {
          this.modalPhone.hide();
          this.utilService.showLoginModal = false;
          this.toastr.success('OTP successfully sent to your mobile number');
          this.openModalShow('modalOtp');
          // this.headerService.showModal = 6;
          // this.displayOtp = 'block';
        }
      } else {
        this.toastr.error('Please enter valid mobile number');
      }
    } else {
      this.toastr.error('MobileNumber is Required');
    }
  };
  resendOtp = async () => {
    this.submitted = true;

    if (this.getPhoneForm['username'].value) {
      if (this.getPhoneForm['username'].valid) {
        const params = {
          username: '+91' + this.getPhoneForm['username'].value,
        };

        const otpResponse = await this.headerService
          .resendOtp(params)
          .toPromise();
        if (otpResponse) {
          this.toastr.success('OTP successfully sent to your mobile number');
        }
      }
    } else {
      this.toastr.error('MobileNumber is Required');
    }
  };
  verifyOtp = async () => {
    if (this.getPhoneForm['otp'].value) {
      this.modalOtp.hide();
      const params = {
        username: '+91' + this.getPhoneForm['username'].value,
        otp: this.getPhoneForm['otp'].value,
      };

      const loginResponse = await this.headerService
        .loginCustomer(params)
        .toPromise();
      if (loginResponse) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('customerId', loginResponse?.user?.id);

        this.utilService.activeCartFetch = true;
        this.openModalShow('modalLoggedin');

        setTimeout(() => {
          this.modalLoggedin.hide();
          if (this.utilService.packageSearch == true) {
            this.router.navigate(['bookings']);
            this.utilService.packageSearch = false;
          }
          // window.location.reload();
        }, 3000);
      }
    }
  };
  closeModal = () => {
    this.phoneForm.reset();
    // this.headerService.showModal = 0;
    // this.displayOtp = 'none';
    // this.headerService.displayLogin = 'none';
    // this.display = 'none';
    this.utilService.showSpinnerData = false;
  };
  goToLoginModal = () => {
    // this.showLoginModal = 1;
    this.modalOtp.hide();
    this.phoneForm.patchValue({
      otp: '',
    });
    this.openModalShow('modalPhone');
    // this.display = 'flex';
    // this.displayOtp = 'none';
  };

  toggleCollapse() {
    if (this.citiesList.length > 1) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
  showCitySubmenu = () => {
    if (this.citiesList.length > 1) {
      this.showSubmenu = !this.showSubmenu;
    }
  };
  selectCityModel = (city: any) => {
    this.selectedCity = city.name;
    // this.isCollapsed = !this.isCollapsed;
    this.modalCity.hide();
    localStorage.setItem('cityId', city.id);
    localStorage.setItem('cityName', city.name);
    const modelId = sessionStorage.getItem('modelId');
    const loggedIn = localStorage.getItem('loggedIn');
    const fuelType = sessionStorage.getItem('fuelType');
    if (loggedIn == 'true') {
      if (!modelId) {
        // this.headerService.showModal = 2;
        this.openModalShow('modalManufacture');
      } else if (!fuelType) {
        /* const matchingCar = this.carsFiltered.find((car) => car.id == modelId);
        this.selectedCar = matchingCar; */
        // this.headerService.showModal = 3;
        this.openModalShow('modalCar');
      } else {
        // this.headerService.showModal = 0;
        // this.display = 'none';
      }
    } else {
      // this.headerService.showModal = 2;
      this.openModalShow('modalManufacture');
    }
  };

  selectCity = (city: any) => {
    this.selectedCity = city.name;
    // this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('cityId', city.id);
    localStorage.setItem('cityName', city.name);
    this.isCollapsed = !this.isCollapsed;
  };
  selectCarBrand = (brand: any) => {
    this.modalManufacture.hide();
    // this.headerService.showModal = 3;
    sessionStorage.setItem('brandId', brand.id);
    sessionStorage.removeItem('modelId');
    sessionStorage.removeItem('fuelType');
    this.loadCarModel(brand.id);
  };
  selectCarModel = (car: any) => {
    /* this.selectedCar = car; */
    this.modalCar.hide();
    sessionStorage.setItem('selectedCar', JSON.stringify(car));
    // this.headerService.showModal = 4;
    sessionStorage.setItem('modelId', car.id);
    // localStorage.setItem('carData', JSON.stringify(car));
    const fuelType = sessionStorage.getItem('fuelType');
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn == 'true') {
      if (!fuelType) {
        // this.headerService.showModal = 4;
        this.openModalShow('modalFuel');
      } else {
        // this.headerService.showModal = 0;
        // this.display = 'none';
      }
    } else {
      // this.headerService.showModal = 4;
      this.openModalShow('modalFuel');
    }
  };

  editCarModel = (car: any) => {
    // this.headerService.showModal = 2;
    this.modalFuel.hide();
    sessionStorage.removeItem('brandId');
    sessionStorage.removeItem('modelId');
    sessionStorage.removeItem('fuelType');
    this.openModalShow('modalManufacture');
  };

  selectFuelType = (fuel: any) => {
    this.selectedFuel = fuel.name;
    sessionStorage.setItem('fuelType', fuel.name);
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
      // this.headerService.showModal = 0;
      this.modalFuel.hide();
      // this.display = 'none';
    } else {
      this.modalFuel.hide();
      // this.headerService.showModal = 5;
      // this.headerService.displayLogin = 'flex';
      this.openModalShow('modalPhone');
    }
    // this.headerService.showModal = 4;
    // this.headerService.displayLogin = 'flex';
  };

  matches = (data: any, searchTerm: string) => {
    return data.name?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  searchModel = (event: any) => {
    this.carsFiltered = this.modelsList.filter((service) =>
      this.matches(service, event)
    );
  };
  searchBrand = (event: any) => {
    this.brandFiltered = this.brandsList.filter((service) =>
      this.matches(service, event)
    );
  };
  loginOld = () => {
    const cityId = localStorage.getItem('cityId');
    const brandId = sessionStorage.getItem('brandId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');
    // this.display = this.headerService.showModal !== 0 ? 'flex' : 'none';
    const showModal = !cityId
      ? this.modalCity.show()
      : !brandId
      ? this.openModalShow('modalManufacture')
      : !modelId
      ? this.modalCar.show()
      : !fuelType
      ? this.modalFuel.show()
      : this.openModalShow('modalPhone');
    // this.headerService.displayLogin =
    //   this.headerService.showModal === 5 ? 'flex' : 'none';
  };
  login = () => {
    const cityId = localStorage.getItem('cityId');
    const brandId = sessionStorage.getItem('brandId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');
    const showModal = !cityId
      ? this.modalCity.show()
      : this.openModalShow('modalPhone');
  };
  openModalShow = (element: string) => {
    if (element === 'modalManufacture') {
      if (this.modalManufacture) {
        this.modalManufacture.dispose();
      }
      this.modalManufacture = new window.bootstrap.Modal(
        document.getElementById('ModalManufacture')
      );
      this.modalManufacture.show();
    } else if (element === 'modalPhone') {
      if (this.modalPhone) {
        this.modalPhone.dispose();
      }
      this.modalPhone = new window.bootstrap.Modal(
        document.getElementById('ModalPhone')
      );
      this.modalPhone.show();
    } else if (element === 'modalOtp') {
      if (this.modalOtp) {
        this.modalOtp.dispose();
      }
      this.modalOtp = new window.bootstrap.Modal(
        document.getElementById('ModalOTP')
      );
      this.modalOtp.show();
    } else if (element === 'modalLoggedin') {
      if (this.modalLoggedin) {
        this.modalLoggedin.dispose();
      }
      this.modalLoggedin = new window.bootstrap.Modal(
        document.getElementById('ModalLoggedin')
      );
      this.modalLoggedin.show();
    } else if (element === 'modalCity') {
      if (this.modalCity) {
        this.modalCity.dispose();
      }
      this.modalCity = new window.bootstrap.Modal(
        document.getElementById('ModalCity')
      );
      if (this.citiesList?.length > 1) {
        this.modalCity.show();
      }
    } else if (element === 'modalCar') {
      if (this.modalCar) {
        this.modalCar.dispose();
      }
      this.modalCar = new window.bootstrap.Modal(
        document.getElementById('ModalCar')
      );
      this.modalCar.show();
    } else if (element === 'modalFuel') {
      if (this.modalFuel) {
        this.modalFuel.dispose();
      }
      this.modalFuel = new window.bootstrap.Modal(
        document.getElementById('ModalFuel')
      );
      this.modalFuel.show();
    }
  };

  // selectServiceAndNavigate(category: any){
  //   console.log('selectServiceAndNavigate--', category);
  //   // checkValuesAndNavigate from home.component.ts
  //   this.router.navigate(['bookings']);
  // }

  startDragging(e: any){
    console.log('startDragging event', e);
  }

  selectServiceAndNavigate = (service: any) => {
    sessionStorage.setItem('selectedPackage', JSON.stringify(service));
    sessionStorage.setItem('packageId', service.id);
    this.emitSessionStorage(service.id);
    this.showServices = false;
    // this.showDropdown = 0;
    // this.util.showModelSelectModal = true;
    this.checkValuesAndNavigate('bookings');
  };
  checkValuesAndNavigate = (url: any) => {
    this.loggedIn =
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') == 'true'
        ? true
        : false;
    // if (
    //   localStorage.getItem('cityId') &&
    //   sessionStorage.getItem('packageId') &&
    //   sessionStorage.getItem('modelId') &&
    //   sessionStorage.getItem('fuelType') &&
    //   sessionStorage.getItem('brandId') &&
    //   sessionStorage.getItem('selectedCar')
    // ) {
      if (!this.loggedIn) {
        this.utilService.showLoginModal = true;
        this.utilService.packageSearch = true;
        // this.toastr.error('Please Login to continue');
      } else {
        this.router.navigate([url]);
      }
    // } else {
    //   this.utilService.showModelSelectModal = true;
    //   this.toastr.error('Select car and service category');
    // }
  };

  loadServicesData = async () => {
    this.utilService.showSpinnerData = true;
    try {
      // this.getAddOnList();
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
        this.modelsList = [];
        this.carsFiltered = [];
        loadModelResponse.map((car: any) => {
          const carDetail = {
            ...car,
            carModel: `${car.brand.name} ${car.name}`,
          };
          this.modelsList.push(carDetail);
          this.carsFiltered.push(carDetail);
        });
        /* if (this.modelId) {
          const selectedCarModel = loadModelResponse.filter(
            (service: any) => service.id === Number(this.modelId)
          );
          this.selectedCarModel = selectedCarModel.length
            ? `${selectedCarModel[0]?.brand?.name} ${selectedCarModel[0]?.name}`
            : '';
          this.selectedCarDetails = selectedCarModel.length
            ? selectedCarModel[0]
            : '';
        } */
      }
      const serviceResponse = await this.bookingService
        .getServiceCategory()
        .toPromise();
      if (serviceResponse) {
        this.servicesList = serviceResponse;
        this.filteredServicesList = this.servicesList.filter((s: any) => {
          return (s.name.indexOf('Exterior Detailing') == -1 && s.name.indexOf('Interior Detailing') == -1 && (s.name.indexOf('Paint Protection') == -1))
        })
        // this.servicesListFiltered = this.servicesList;
        // if (this.packageId) {
        //   const selectedService = serviceResponse.filter(
        //     (service: any) => service.id === Number(this.packageId)
        //   );
        //   this.selectedService = selectedService.length
        //     ? selectedService[0]
        //     : null;
        // }
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };

  emitSessionStorage(val: number) {
    this.utilService.updateData(val);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}

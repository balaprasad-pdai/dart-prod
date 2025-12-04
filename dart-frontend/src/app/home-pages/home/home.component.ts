import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import sal from 'sal.js';
import { HomePagesService } from '../home-pages-service';
import { BlogsService } from '../../blog-pages/blogs/blogs.service';
import { UtilService } from 'src/app/util.service';
import { BookingsService } from 'src/app/bookings/bookings-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  serviseOptions!: OwlOptions;
  blogsOptions!: OwlOptions;
  couponsOptions!: OwlOptions;
  testimonialOptions!: OwlOptions;
  showDropdown = 0;
  // showServiceDropdown = false;
  servicesList: any[] = [];
  servicesListFiltered: any[] = [];
  selectedCarDetails!: any;
  blogcategory: any[] = [];
  categoryColors: any[] = [];
  // cars = [
  //   {
  //     name: "Maruti Suzuki Swift",
  //     image: "../../assets/images/car/3.png"
  //   },
  //   {
  //     name: "Maruti Suzuki Alto K10",
  //     image: "../../assets/images/car/1.png"
  //   },
  //   {
  //     name: "Hyundai Grand i10",
  //     image: "../../assets/images/car/2.png"
  //   }
  // ]
  blogsList: any[] = [];
  couponsList = [
    {
      name: 'Flat ₹500 OFF',
      code: 'FIXFIRST',
      backgroundColor: '',
      description: '₹ 500 off for first booking ',
      description2: 'from app for first time user',
    },
    {
      name: 'Flat ₹500 OFF',
      code: 'FIXFIRST',
      backgroundColor: 'bg_red',
      description: '₹ 500 off for first booking ',
      description2: 'from app for first time user',
    },
    {
      name: 'Flat ₹500 OFF',
      code: 'FIXFIRST',
      backgroundColor: 'bg_green',
      description: '₹ 500 off for first booking ',
      description2: 'from app for first time user',
    },
    {
      name: 'Flat ₹500 OFF',
      code: 'FIXFIRST',
      backgroundColor: 'bg_red',
      description: '₹ 500 off for first booking ',
      description2: 'from app for first time user',
    },
    {
      name: 'Flat ₹500 OFF',
      code: 'FIXFIRST',
      backgroundColor: 'bg_green',
      description: '₹ 500 off for first booking ',
      description2: 'from app for first time user',
    },
  ];
  brandsList: any[] = [];
  modelsList: any[] = [];
  bgColors: any[] = ['bg_1', 'bg_2', 'bg_3', 'bg_4', 'bg_5', 'bg_6', 'bg_7'];
  brandsOptions!: OwlOptions;
  modelSearchTerm: string = '';
  serviceSearchTerm: string = '';
  selectedService: any;
  selectedServiceNew: any;
  carsFiltered: any[] = [];
  servicesFiltered: any[] = [];
  services: any[] = [];
  loggedIn!: boolean;
  activeCartList: any;
  car!: any;
  showDropdownInner = false;
  fullBodyPaint!: any;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: false,
    autoWidth: false,
    nav: true,
    navSpeed: 700,
    // navText: [ '<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right></i>"' ],
    navText: ['<i class="fas fa-angle-left fa-2x"></i>', '<i class="fas fa-angle-right fa-2x"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
  constructor(
    private router: Router,
    public service: HomePagesService,
    private blogService: BlogsService,
    private util: UtilService,
    private bookingService: BookingsService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    sal();
    // this.servicesListFiltered = this.servicesList;
    // this.carsFiltered = this.cars
    this.loadServices();
    this.loadData();
    const prevArrow = `<span aria-label="Previous" class="prev_btn"><i class="ti ti-arrow-left"></span>`;
    const nextArrow = `<span aria-label="Next" class="next_btn"><i class="ti ti-arrow-right"></span>`;
    this.testimonialOptions = {
      loop: true,
      margin: 10,
      nav: true,
      items: 1,
      navText: [prevArrow, nextArrow],
    };
    this.loadBlogCategory();
    this.loggedIn =
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') == 'true'
        ? true
        : false;
    if (this.loggedIn) {
      this.getActiveCartData();
    }
  }
  ngDoCheck() {
    const selectedCar = sessionStorage.getItem('selectedCar');
    this.selectedCarDetails = selectedCar ? JSON.parse(selectedCar) : null;
    const selectService = sessionStorage.getItem('selectedPackage');
    this.selectedService = selectService
      ? JSON.parse(selectService)
      : {
          name: 'Select Service',
          logoUrl: 'assets/images/services/serv-2.png',
        };
    if (this.util.activeCartFetch) {
      this.getActiveCartData();
      this.util.activeCartFetch = false;
    }
  }
  getActiveCartData = async () => {
    const userId = localStorage.getItem('customerId');
    try {
      const responseActiveCartList = await this.bookingService
        .getActiveCartService(userId)
        .toPromise();
      if (responseActiveCartList?.id) {
        this.activeCartList = responseActiveCartList;

        if (this.activeCartList?.orderMeta?.package?.length) {
          sessionStorage.setItem('cart', 'true');
          if (this.activeCartList?.orderMeta?.package[0].cityId) {
            localStorage.setItem(
              'cityId',
              this.activeCartList?.orderMeta?.package[0].cityId
            );
          }
          if (this.activeCartList?.orderMeta?.package[0].modelId) {
            sessionStorage.setItem(
              'modelId',
              this.activeCartList?.orderMeta?.package[0].modelId
            );
            const selectedCar = this.modelsList.filter(
              (model) =>
                model.id == this.activeCartList?.orderMeta?.package[0].modelId
            );
            if (selectedCar.length) {
              sessionStorage.setItem(
                'selectedCar',
                JSON.stringify(selectedCar[0])
              );
              sessionStorage.setItem('brandId', selectedCar[0].brandId);
            }
          }
          if (this.activeCartList?.orderMeta?.vehicleData.fuelType) {
            sessionStorage.setItem(
              'fuelType',
              this.activeCartList?.orderMeta?.package[0].fuelType
            );
          }
        } else {
          sessionStorage.setItem('cart', 'false');
        }
      }
    } catch (error) {
      // this.utilService.showSpinnerData = false;
    }
  };
  loadBlogCategory = async () => {
    try {
      const blogCategoryList = await this.blogService
        .getBlogCategory()
        .toPromise();
      if (blogCategoryList?.length) {
        this.blogcategory = blogCategoryList;
        const blogDetailsList = await this.blogService
          .getBlogsList()
          .toPromise();

        if (blogDetailsList?.length) {
          this.blogsOptions = {};
          this.blogsList = blogDetailsList;
          this.blogsOptions = {
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            dots: false,
            navSpeed: 700,
            navText: ['&lsaquo;', '&rsaquo;'],
            margin: 5,
            responsive: {
              0: {
                items: 1.3,
              },
              400: {
                items: 1.7,
              },
              600: {
                items: 2.1,
              },
              740: {
                items: 2.3,
              },
              840: {
                items: 2.8,
              },
              940: {
                items: 3.2,
              },
              1200: {
                items: 4.2,
              },
            },
            nav: true,
          };
        }
      }
    } catch (error) {}
  };
  getCategoryColors = (serviceResponse: any[]) => {
    serviceResponse.forEach((service, ind) => {
      if (
        service.name.toLowerCase().includes('denting') ||
        service.name.toLowerCase().includes('tyre replacement')
      ) {
        this.categoryColors.push('bg_1');
      } else if (
        service.name.toLowerCase().includes('periodic service') ||
        service.name.toLowerCase().includes('battery replacement')
      ) {
        this.categoryColors.push('bg_2');
      } else if (service.name.toLowerCase().includes('interior detailing')) {
        this.categoryColors.push('bg_7');
      } else if (service.name.toLowerCase().includes('paint protection')) {
        this.categoryColors.push('bg_6');
      } else if (service.name.toLowerCase().includes('car ac service')) {
        this.categoryColors.push('bg_3');
      } else if (service.name.toLowerCase().includes('full body paint')) {
        this.categoryColors.push('bg_5');
      } else if (service.name.toLowerCase().includes('exterior detailing')) {
        this.categoryColors.push('bg_4');
      }
      if (ind == 8) {
        localStorage.setItem(
          'categoryColors',
          JSON.stringify(this.categoryColors)
        );
      }
    });
    return this.categoryColors;
  };

  getFullBodyPaintCategory = () => {
    const service = this.servicesList.filter((item) =>
      item.name.toLowerCase().includes('full body paint')
    );
    return (this.fullBodyPaint = service?.length ? service[0] : null);
  };
  loadData = async () => {
    try {
      const loadBrandResponse = await this.service.getBrands().toPromise();
      if (loadBrandResponse) {
        this.brandsList = loadBrandResponse;
      }
      const loadModelResponse = await this.service.getCarModels().toPromise();
      if (loadModelResponse) {
        this.modelsList = loadModelResponse;
        this.carsFiltered = this.modelsList;
      }
      const serviceResponse = await this.service
        .getServiceCategory()
        .toPromise();
      if (serviceResponse) {
        this.servicesList = serviceResponse;
        console.log('servicesList', this.servicesList);
        this.categoryColors = [];
        const categoryColorsArray = localStorage.getItem('categoryColors');
        if (categoryColorsArray) {
          this.categoryColors = JSON.parse(
            localStorage.getItem('categoryColors') || '[]'
          );
        } else {
          this.categoryColors = this.getCategoryColors(serviceResponse);
        }
        // for (let i = 0; i < this.servicesList.length; i++) {
        //   const colors = [
        //     'bg_1',
        //     'bg_2',
        //     'bg_3',
        //     'bg_4',
        //     'bg_5',
        //     'bg_6',
        //     'bg_7',
        //     'bg_8',
        //   ];
        //   var bg_color = colors[Math.floor(Math.random() * colors.length)];
        //   this.bgColors.push(bg_color);
        // }
        this.servicesListFiltered = this.servicesList;
      }
    } catch (error) {}
  };
  loadServices = async () => {
    this.serviseOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      navSpeed: 7000000,
      navText: ['&lsaquo;', '&rsaquo;'],
      margin: 5,
      autoplay: false,
      responsive: {
        0: {
          items: 1.3,
        },
        400: {
          items: 1.8,
        },
        600: {
          items: 2.8,
        },
        790: {
          items: 3.2,
        },
        940: {
          items: 4.2,
        },
        1200: {
          items: 5.2,
        },
      },
      nav: true,
    };
    this.brandsOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['&lsaquo;', '&rsaquo;'],
      margin: 5,
      responsive: {
        0: {
          items: 1.2,
        },
        400: {
          items: 1.2,
        },
        600: {
          items: 2,
        },
        740: {
          items: 3.3,
        },
        940: {
          items: 4.2,
        },
        1200: {
          items: 5.2,
        },
      },
      nav: true,
    };

    this.couponsOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['&lsaquo;', '&rsaquo;'],
      margin: 5,
      responsive: {
        0: {
          items: 1.2,
        },
        400: {
          items: 1.2,
        },
        600: {
          items: 1.2,
        },
        740: {
          items: 2.3,
        },
        940: {
          items: 3.2,
        },
        1200: {
          items: 3.2,
        },
      },
      nav: true,
    };
  };
  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };
  checkPriceAndNavigate(url: string){
    this.loggedIn =
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') == 'true'
        ? true
        : false;
    if (!this.loggedIn) {
      this.util.showLoginModal = true;
      this.util.packageSearch = true;
      // this.toastr.error('Please Login to continue');
    } else {
      this.router.navigate([url]);
    }
  }
  checkValuesAndNavigate = (url: any) => {
    this.loggedIn =
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') == 'true'
        ? true
        : false;
    if (
      localStorage.getItem('cityId')
      // sessionStorage.getItem('packageId') &&
      // sessionStorage.getItem('modelId') &&
      // sessionStorage.getItem('fuelType') &&
      // sessionStorage.getItem('brandId') &&
      // sessionStorage.getItem('selectedCar')
    ) {
      if (!this.loggedIn) {
        this.util.showLoginModal = true;
        this.util.packageSearch = true;
        // this.toastr.error('Please Login to continue');
      } else {
        this.router.navigate([url]);
      }
    } else {
      this.util.showModelSelectModal = true;
      this.toastr.error('Select car and service category');
    }
  };
  showFuelTypeDropdown = (car: any) => {
    // this.carsFiltered.map((car) => (car.showDropdownInner = false));
    this.car = car;
    this.showDropdownInner = true;
    this.showDropdown = 0;
    // this.car.showDropdownInner = true;
  };
  selectModel = (car: any, fuelType: any) => {
    /* this.selectedCarDetails = car; */
    sessionStorage.setItem('modelId', car.id);
    sessionStorage.setItem('fuelType', fuelType);
    sessionStorage.setItem('brandId', car.brand.id);
    sessionStorage.setItem('selectedCar', JSON.stringify(car));
    this.showDropdown = 0;
    this.showDropdownInner = false;
    this.dropdownHideAndShow(0);
  };
  getFuelImage = (fuelType: any) => {
    const selectedFuel = this.util.fuels.filter(
      (fuel) => fuel.name == fuelType
    );
    return selectedFuel?.length ? selectedFuel[0]?.image : '';
  };
  selectService = (service: any) => {
    sessionStorage.setItem('selectedPackage', JSON.stringify(service));
    sessionStorage.setItem('packageId', service.id);
    this.showDropdown = 0;
  };
  selectServiceAndNavigate = (service: any) => {
    sessionStorage.setItem('selectedPackage', JSON.stringify(service));
    sessionStorage.setItem('packageId', service.id);
    this.showDropdown = 0;
    // this.util.showModelSelectModal = true;
    this.checkValuesAndNavigate('bookings');
  };
  matches = (data: any, searchTerm: string) => {
    return (
      data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
  readMoreAboutUs = () => {
    this.util.showAboutUsModal = true;
  };
  getCategoryName = (id: any) => {
    const category = this.blogcategory.filter(
      (category: any) => category.id == id
    );
    return category.length ? category[0].name : '-';
  };
  goToDetailsPage = (id: any) => {
    localStorage.setItem('blogId', id);
    this.router.navigate(['blogs/details']);
  };

  onServiceChange(e: any){
    const selctedService = this.servicesList.find((s: any) => s.id == this.selectedServiceNew);
    sessionStorage.setItem('selectedPackage', JSON.stringify(selctedService));
    sessionStorage.setItem('packageId', this.selectedServiceNew);
  }
}

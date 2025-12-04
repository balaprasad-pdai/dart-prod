import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from '../bookings-service';
import { OrderService } from '../order-service';
import { UtilService } from 'src/app/util.service';
import { LoginService } from 'src/app/header/login-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
declare let window: any;
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
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
  selectedCarModel: any;
  selectedService = {
    name: 'Select Service',
    logoUrl: 'assets/images/services/1.png',
  };
  modelSearchTerm: string = '';
  carsFiltered: any[] = [];
  modelsList: any[] = [];
  service: any[] = [];
  getBrands: any;
  selectedPanelList: any[] = [];
  addOnList: any[] = [];
  filteredAddonList: any[] = [];
  serviceSearchTerm: string = '';
  typeOfWorkList: any[] = [];
  // displayAddOns = 'none';
  // display = 'none';
  showModal = false;
  gradeList: any[] = [];
  selectedPackageList: any = { addons: null };
  activeCartList: any;
  replaceService: any;
  noDataFound = '';
  packageList: any[] = [];
  car!: any;
  showDropdownInner = false;
  // brandsList = [
  //   '../../assets/images/brands/1.png',
  //   '../../assets/images/brands/2.png',
  //   '../../assets/images/brands/3.png',
  //   '../../assets/images/brands/4.png',
  // ];
  selectedPanel!: any;
  clicked = false;
  showOrderSuccessModal = false;
  order!: any;
  selectedCarDetails!: any;
  modalAddOn!: any;
  modalCheckout!: any;
  page = 1;
  itemsPerpage = 5;
  constructor(
    private router: Router,
    private bookingService: BookingsService,
    public orderService: OrderService,
    public utilService: UtilService,
    public headerService: LoginService,
    private toastr: ToastrService
  ) {
    this.subscription = this.utilService.data$.subscribe((data) => {
      this.selectedService = this.servicesList.find((s) => s.id == data);
      this.searchPackageListNew();
    });
  }
  ngOnInit() {
    this.packageId = sessionStorage.getItem('packageId');
    this.modelId = sessionStorage.getItem('modelId');
    this.cityId = localStorage.getItem('cityId');
    // if (this.orderService.orderComplete) {
    //   this.order = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    //   if (this.modalAddOn) {
    //     this.modalAddOn.dispose();
    //   }
    //   if (this.modalCheckout) {
    //     this.modalCheckout.dispose();
    //   }
    //   this.modalCheckout = new window.bootstrap.Modal(
    //     document.getElementById('ModalCheckout')
    //   );

    //   this.modalCheckout.show();
    //   this.orderService.orderComplete = false;
    // }
    this.getActiveCartData();
    // this.loadData();
    this.loadDataNew()
    this.searchPackageList();
    // this.getSelectedPackages();
    this.searchPackageListNew();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.orderService.orderComplete) {
        this.order = JSON.parse(localStorage.getItem('orderDetails') || '{}');
        if (this.modalCheckout) {
          this.modalCheckout.dispose();
        }
        this.modalCheckout = new window.bootstrap.Modal(
          document.getElementById('ModalCheckout')
        );

        this.modalCheckout.show();
        this.orderService.orderComplete = false;
      }
    }, 2000);
  }
  ngDoCheck() {
    const selectedCarDetail = sessionStorage.getItem('selectedCar');
    this.selectedCarModel = selectedCarDetail
      ? JSON.parse(selectedCarDetail)
      : 'Select Car model';
    this.fuelType = sessionStorage.getItem('fuelType');
  }

  searchPackageList = () => {
    this.packageId = sessionStorage.getItem('packageId');
    this.modelId = sessionStorage.getItem('modelId');
    this.cityId = localStorage.getItem('cityId');
    this.fuelType = sessionStorage.getItem('fuelType');
    if (this.packageId && this.modelId && this.cityId && this.fuelType) {
      this.clicked = false;
      this.getAllPackages();
    } else {
      if (!this.packageId && this.modelId && this.cityId && this.fuelType) {
        this.toastr.error('Select service category');
      } else {
        this.utilService.showModelSelectModal = true;
      }
    }
  };
  searchPackageListNew = () => {
    this.packageId = sessionStorage.getItem('packageId');
    this.modelId = sessionStorage.getItem('modelId');
    this.cityId = localStorage.getItem('cityId');
    this.fuelType = sessionStorage.getItem('fuelType');
    // if (this.packageId && this.modelId && this.cityId && this.fuelType) {
    //   this.clicked = false;
      this.getAllPackages();
    // } else {
    //   if (!this.packageId && this.modelId && this.cityId && this.fuelType) {
    //     this.toastr.error('Select service category');
    //   } else {
    //     this.utilService.showModelSelectModal = true;
    //   }
    // }
  };
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };

  getSelectedPackages = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const selectedPackagesPrice = await this.bookingService
        .getPackagePricesByQuery(this.modelId, this.cityId, this.fuelType)
        .toPromise();
      if (selectedPackagesPrice) {
        this.selectedPackagePriceList = selectedPackagesPrice;

        this.utilService.showSpinnerData = false;
        return;
      }
      this.utilService.showSpinnerData = false;
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };

  getAllPackages = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const selectedPackagesPrice = await this.bookingService
        .getPackagePricesByQuery(this.modelId, this.cityId, this.fuelType)
        .toPromise();

      if (selectedPackagesPrice) {
        this.selectedPackagePriceList = selectedPackagesPrice;
      }
      const packageParam = this.packageId
        ? `?categoryId=${this.packageId}`
        : ``;
      const packageResponse = await this.bookingService
        .getAllPackages(packageParam)
        .toPromise();
      const getAllPackagesPrice = await this.bookingService
        .getAllPackagesPrice()
        .toPromise();
      this.filteredPackageList = [];
      this.utilService.showSpinnerData = false;
      if (packageResponse?.length) {
        this.packageList = packageResponse?.filter(
          (packageData: any) => packageData.status === 'active'
        );
        this.packageList.forEach((p:any) =>{
          if(p.checkboxes && p.checkboxes.length){
            p.checkboxes.forEach((e: any) => {
              e.checked = false;
            });
          }
        });
        this.packagePrice = getAllPackagesPrice;
        this.getTypeOfWork();
        this.panelPricing();
        if (selectedPackagesPrice?.length) {
          this.selectedPackagePriceList.forEach((item) => {
            const service = this.packageList.find(
              (data) => data.id == item.packageId
            );
            if (service && JSON.stringify(service) !== '') {
              this.filteredPackageList = [...this.filteredPackageList, service];
            }
          });
        }
        this.utilService.showSpinnerData = false;
        this.noDataFound = '';
      } else {
        this.noDataFound = 'No matching package found.';
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
      this.noDataFound = 'No matching package found.';
    }
  };
  getTypeOfWork = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const typeOfWorkResponse = await this.bookingService
        .getTypeOfWork()
        .toPromise();
      if (typeOfWorkResponse?.length) {
        this.typeOfWorkList = typeOfWorkResponse?.filter(
          (typeOfWorkData: any) => typeOfWorkData.status === 'active'
        );
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };
  selectPanel = async (panel: any) => {
    this.utilService.showSpinnerData = true;
    this.selectedPanelList.map(
      (panelList) =>
        (panelList.clicked =
          panelList?.id !== panel?.id ? false : panelList.clicked)
    );
    panel.clicked = panel.clicked ? false : true;
    this.utilService.showSpinnerData = false;
  };
  showWholeDesc = async (service: any) => {
    service.viewMore = true;
  };
  showLess = async (service: any) => {
    service.viewMore = false;
  };

  serviceAddToCart = async (service: any, typeofWorkdata: any = undefined) => {
    this.utilService.showSpinnerData = true;
    const loggedIn = localStorage.getItem('loggedIn');
    const brandId = sessionStorage.getItem('brandId');
    const cityId = localStorage.getItem('cityId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');
    if(service.subtype == 'checkbox'){
      let filtered = service.checkboxes.filter((c: any) => c.checked);
      if(!filtered.length){
        this.toastr.error('Please select a service')
        this.utilService.showSpinnerData = false;
        return;
      }
    }
    if (!loggedIn) {
      if (!cityId || !brandId || !modelId || !fuelType) {
        this.utilService.showModelSelectModal = true;
      } else {
        this.utilService.showLoginModal = true;
      }
      // this.display = this.headerService.showModal !== 0 ? 'flex' : 'none';
      // this.headerService.showModal = !cityId
      //   ? 1
      //   : !brandId
      //   ? 2
      //   : !modelId
      //   ? 3
      //   : !fuelType
      //   ? 4
      //   : 5;
      // this.headerService.displayLogin =
      //   this.headerService.showModal === 5 ? 'flex' : 'none';
      return;
    }
    this.filteredAddonList = this.addOnList.filter(
      (addOn) =>
        addOn.packageId === service.id &&
        addOn.cityId === Number(cityId) &&
        addOn.modelId === Number(modelId) &&
        addOn.fuelType === fuelType
    );
    this.utilService.showSpinnerData = false;
    const priceAndOfferPriceList = this.packagePrice?.length
      ? this.packagePrice.filter(
          (packagePrice) =>
            packagePrice.packageId === service.id &&
            packagePrice.cityId === Number(cityId) &&
            packagePrice.modelId === Number(modelId) &&
            packagePrice.fuelType === fuelType
        )
      : [];
    const priceAndOfferPrice = priceAndOfferPriceList?.length
      ? {
          price: priceAndOfferPriceList[0].price,
          slashedPrice: priceAndOfferPriceList[0].slashedPrice,
          fuelType: priceAndOfferPriceList[0].fuelType,
          modelId: priceAndOfferPriceList[0].modelId,
          cityId: priceAndOfferPriceList[0].cityId,
        }
      : { price: 0, slashedPrice: 0, fuelType: '', modelId: 0, cityId: 0 };

    if (typeofWorkdata) {
      const typeofWorkDetails = {
        name: typeofWorkdata.name,
        status: typeofWorkdata.status,
        price: service.price,
        slashedPrice: service.slashedPrice,
      };
      const updatedServiceList = {
        ...typeofWorkDetails,
        ...service,
      };
      this.selectedPackageList = updatedServiceList;
    } else {
      const updatedServiceList = {
        ...service,
        ...priceAndOfferPrice,
      };
      this.selectedPackageList = updatedServiceList;
    }

    if (this.filteredAddonList?.length) {
      // this.displayAddOns = 'block';
      // this.display = 'flex';
      // this.showModal = true;
      if (this.modalAddOn) {
        this.modalAddOn.dispose();
      }
      this.modalAddOn = new window.bootstrap.Modal(
        document.getElementById('modalAddOn')
      );
      this.modalAddOn.show();
      this.filteredAddonList.map((addon) => (addon.selected = false));
      this.replaceService = null;
      return;
    }
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      /* Addons */
      this.selectedPackageList.addons = {};
      if (typeofWorkdata) {
        (this.selectedPackageList.name = typeofWorkdata.name),
          (this.selectedPackageList.status = typeofWorkdata.status),
          this.getActiveCartData(this.selectedPackageList);
      } else {
        this.getActiveCartData(this.selectedPackageList);
      }
    } else {
      this.utilService.headerShowModal = 1;
    }
  };
  closeModal = () => {
    // this.showModal = false;
    this.modalAddOn.hide();
    // this.displayAddOns = 'none';
    // this.display = 'none';
    this.filteredAddonList.map((addon) => (addon.selected = false));
  };
  panelPricing = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const selectedPanelPrice = await this.bookingService
        .panelPriceLoading(
          this.modelId,
          this.cityId,
          this.fuelType,
          this.packageId
        )
        .toPromise();
      if (selectedPanelPrice) {
        console.log('in selectedPanelPrice', selectedPanelPrice);
        this.selectedPanelList = [];
        this.addOnList = [];

        selectedPanelPrice.forEach((item: any) => {
          const service = this.packageList.find(
            (data) =>
              data?.id == item?.packageId &&
              this.selectedPanelList.findIndex(
                (panel) =>
                  panel?.carPanel?.part?.id === item?.carPanel?.part?.id &&
                  item?.carPanel?.part?.status === 'active'
              ) === -1 &&
              !item?.gradeId
          );

          if (service && JSON.stringify(service) !== '') {
            const otherPanelList = selectedPanelPrice.filter(
              (panelList: any) =>
                panelList?.carPanel?.part?.id === item?.carPanel?.part?.id &&
                item?.carPanel?.part?.status === 'active'
            );

            if (otherPanelList?.length) {
              const typeOfWorkList = {
                ...item,
                selectedPanelWorkList: otherPanelList,
              };
              this.selectedPanelList.push(typeOfWorkList);
            }
          }
          const addOnService = this.filteredPackageList.find(
            (data) =>
              data?.id == item?.packageId &&
              this.addOnList.findIndex(
                (panel) => panel?.gradeId === item?.gradeId
              ) === -1 &&
              item?.gradeId
          );
          if (addOnService && JSON.stringify(addOnService) !== '') {
            item.gradeList = this.gradeList?.length
              ? this.getAddOnGradeList(item.gradeId)
              : {};
            this.addOnList.push(item);
          }
        });
        if (
          !this.selectedPanelList.length &&
          !this.filteredPackageList.length
        ) {
          this.noDataFound = 'No matching package found.';
        } else {
          this.noDataFound = '';
        }
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };

  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };

  selectModel = (car: any, fuelType: any) => {
    /* this.selectedCarDetails = car; */
    sessionStorage.setItem('modelId', car.id);
    sessionStorage.setItem('fuelType', fuelType);
    sessionStorage.setItem('brandId', car.brand.id);
    sessionStorage.setItem('selectedCar', JSON.stringify(car));
    this.showDropdown = 0;
    this.showDropdownInner = false;
    this.searchPackageList();

    if (this.activeCartList) {
      const { orderMeta } = this.activeCartList;

      if (
        orderMeta?.package?.length &&
        (orderMeta.package[0].modelId !== car.id ||
          orderMeta.package[0].fuelType !== fuelType)
      ) {
        const { id, status, userId } = this.activeCartList;
        const orderMetaData = {
          package: [],
          totalAmount: 0,
        };
        const params = {
          orderMeta: orderMetaData,
          id,
          paymentTotal: 0,
          status,
          userId,
        };
        this.addOrUpdateToCart(userId, params);
      }
      this.dropdownHideAndShow(0);
    }
  };
  getFuelImage = (fuelType: any) => {
    const selectedFuel = this.utilService.fuels.filter(
      (fuel) => fuel.name == fuelType
    );
    return selectedFuel?.length ? selectedFuel[0]?.image : '';
  };
  showFuelTypeDropdown = (car: any) => {
    // this.carsFiltered.map((car) => (car.showDropdownInner = false));
    this.car = car;
    this.showDropdownInner = true;
    this.showDropdown = 0;
    // this.car.showDropdownInner = true;
  };
  selectService = (service: any) => {
    this.selectedService = service;
    this.selectedPanelList = [];
    this.filteredPackageList = [];
    sessionStorage.setItem('packageId', service.id);
    this.showDropdown = 0;
    // this.searchPackageList();
    this.searchPackageListNew();
  };
  matches = (data: any, searchTerm: string, type: string) => {
    return type === 'car-service'
      ? data.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : data.carModel?.toLowerCase().includes(searchTerm.toLowerCase());
  };
  searchModel = (event: any) => {
    this.carsFiltered = this.modelsList.filter((service) =>
      this.matches(service, event, 'car-model')
    );
  };
  searchService = (event: any) => {
    this.servicesListFiltered = this.servicesList.filter((service) =>
      this.matches(service, event, 'car-service')
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
    this.utilService.showSpinnerData = true;
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

        this.servicesListFiltered = this.servicesList;
        if (this.packageId) {
          const selectedService = serviceResponse.filter(
            (service: any) => service.id === Number(this.packageId)
          );
          this.selectedService = selectedService.length
            ? selectedService[0]
            : null;
        }
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };
  getActiveCartData = async (updateCart: any = undefined) => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      try {
        const responseActiveCartList = await this.bookingService
          .getActiveCartService(userId)
          .toPromise();
        if (responseActiveCartList?.id) {
          this.activeCartList = responseActiveCartList;

          if (updateCart) {
            const { orderMeta, id, status, userId } = responseActiveCartList;
            const { package: packageName } = orderMeta;
            const updatePackage = [...packageName, updateCart];
            let totalAmount = 0;
            updatePackage.map((packageList: any) => {
              if (packageList?.addons?.slashedPrice) {
                totalAmount += packageList.addons.slashedPrice;
              } else if (packageList?.addons?.price) {
                totalAmount += packageList.addons.price;
              }
              if (packageList.slashedPrice) {
                totalAmount += packageList.slashedPrice;
              } else {
                totalAmount += packageList.price;
              }
            });
            const orderMetaData = {
              package: updatePackage,
              totalAmount,
            };
            const params = {
              orderMeta: orderMetaData,
              id,
              paymentTotal: totalAmount,
              status,
              userId,
            };
            this.addOrUpdateToCart(userId, params);
          } else {
            this.utilService.showSpinnerData = false;
          }
        } else {
          if (updateCart) {
            const updatePackage = [updateCart];

            let totalAmount = 0;
            updatePackage.map((packageList: any) => {
              if (packageList?.addons?.slashedPrice) {
                totalAmount += packageList.addons.slashedPrice;
              } else if (packageList?.addons?.price) {
                totalAmount += packageList.addons.price;
              }
              if (packageList.slashedPrice) {
                totalAmount += packageList.slashedPrice;
              } else if (packageList.price) {
                totalAmount += packageList.price;
              }
            });
            const orderMetaData = {
              package: updatePackage,
              totalAmount,
            };
            const params = {
              orderMeta: orderMetaData,
              paymentTotal: totalAmount,
              status: 'active',
              userId,
            };
            this.addOrUpdateToCart(userId, params);
          } else {
            this.utilService.showSpinnerData = false;
          }
        }
      } catch (error) {
        this.utilService.showSpinnerData = false;
      }
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
    // this.searchPackageListNew();
    return activeService.length ? activeService[0].name : '';
  };
  getAddOnList = async () => {
    this.utilService.showSpinnerData = true;
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
      } catch (error) {
        this.utilService.showSpinnerData = false;
      }
    }
  };
  getPackageWorksTypes = (partsTypeOfWorkId: any, field: string) => {
    if (field == 'length') {
      const selectedTypeOfWork = this.typeOfWorkList?.filter(
        (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
      );
      return selectedTypeOfWork?.length ? selectedTypeOfWork : null;
    } else if (field == 'name') {
      const selectedTypeOfWork = this.typeOfWorkList?.filter(
        (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
      );
      return selectedTypeOfWork?.length ? selectedTypeOfWork[0].name : '';
    } else if (field == 'typedata') {
      const selectedTypeOfWork = this.typeOfWorkList?.filter(
        (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
      );
      return selectedTypeOfWork?.length ? selectedTypeOfWork[0] : '';
    } else if (field == 'logoUrl') {
      const selectedTypeOfWork = this.typeOfWorkList?.filter(
        (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
      );
      return selectedTypeOfWork?.length
        ? selectedTypeOfWork[0]?.metaInfo?.logoUrl
        : '';
    } else if (field == 'description') {
      const selectedTypeOfWork = this.typeOfWorkList?.filter(
        (typeOfWork) => typeOfWork.id === partsTypeOfWorkId
      );

      return selectedTypeOfWork?.length
        ? selectedTypeOfWork[0]?.metaInfo?.description
        : '';
    }
  };
  getAddOnGradeList = (partsTypeOfWorkId: any) => {
    const selectedTypeOfWork = this.gradeList?.filter(
      (typeOfWork: any) => typeOfWork.id === partsTypeOfWorkId
    );
    return selectedTypeOfWork?.length ? selectedTypeOfWork[0] : {};
  };
  addonSelect = (selectedAddOn: any) => {
    this.filteredAddonList.map((addon) => (addon.selected = false));
    if (this.replaceService) {
      const { orderMeta: orderData, userId, status } = this.replaceService;
      const { package: packageData } = orderData;
      packageData.map((packageList: any) => {
        if (packageList.id === selectedAddOn.packageId) {
          packageList.addons = selectedAddOn;
        }
      });
      const totalAmount = packageData?.length
        ? packageData
            ?.map(
              (pack: any) =>
                (pack?.slashedPrice
                  ? pack.slashedPrice
                  : pack.price
                  ? pack.price
                  : 0) +
                (pack?.addons?.slashedPrice
                  ? pack.addons.slashedPrice
                  : pack.addons.price
                  ? pack.addons.price
                  : 0)
            )
            .reduce((a: number, b: number) => a + b)
        : 0;
      const orderMeta = {
        package: packageData,
        totalAmount,
      };
      this.replaceService = {
        orderMeta,
        paymentTotal: totalAmount,
        status,
        userId,
      };
    }
    this.selectedPackageList.addons = selectedAddOn;
    selectedAddOn.selected = true;
  };
  addAddonToSelectedPackageAndUpdateCart = async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      if (this.replaceService) {
        this.addOrUpdateToCart(this.replaceService.userId, this.replaceService);
        return;
      }
      this.getActiveCartData(this.selectedPackageList);
    }
  };
  addOrUpdateToCart = async (userId: any, params: any) => {
    try {
      const addToCart = await this.bookingService
        .addToCartService(userId, params)
        .toPromise();
      if (addToCart?.id) {
        this.utilService.showSpinnerData = false;
        this.activeCartList = addToCart;
        if (addToCart?.orderMeta?.package?.length) {
          sessionStorage.setItem('cart', 'true');
        } else {
          sessionStorage.setItem('cart', 'false');
        }

        this.closeModal();
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };
  addOrRemoveServiceButton = (selectedPackage: any, type: string) => {
    if (type === 'normal') {
      const activeCartItemPackageId =
        this.activeCartList?.orderMeta?.package?.filter(
          (filterPackage: any) => filterPackage.id === selectedPackage.id
        );
      const activeCartItemCategoryId =
        this.activeCartList?.orderMeta?.package?.filter(
          (filterPackage: any) =>
            filterPackage?.categoryId === selectedPackage?.categoryId
        );
      return activeCartItemPackageId?.length
        ? 1
        : (activeCartItemCategoryId?.length && selectedPackage.subtype == 'normal')
        ? 2
        : 3;
    } else {
      const activeCartItemPackageId =
        this.activeCartList?.orderMeta?.package?.filter(
          (filterPackage: any) =>
            filterPackage?.carPanel?.partTypeId ===
              selectedPackage?.carPanel?.partTypeId &&
            filterPackage?.typeOfWorkId === selectedPackage?.typeOfWorkId
        );
      const activeCartItemCategoryId =
        this.activeCartList?.orderMeta?.package?.filter(
          (filterPackage: any) =>
            filterPackage?.carPanel?.partTypeId ===
            selectedPackage?.carPanel?.partTypeId
        );
      return activeCartItemPackageId?.length
        ? 1
        : activeCartItemCategoryId?.length
        ? 2
        : 3;
    }
  };
  calculateGST = (paymentTotal: any) => {
    return Number(paymentTotal) * 0.18;
  };
  parseInt = (paymentTotal: any) => {
    return Number(paymentTotal);
  };
  getServiceDescription = (services: any) => {
    const name = this.getPackageWorksTypes(services?.typeOfWorkId, 'name');
    if (name === 'Remove all Dents') {
      return `<h4 class="hidden font-semibold md:flex">Defect</h4><p class="hidden col-span-5 md:flex">123456789 When the shape of the car panel is deformed such that there is no tear of the metal sheet</p><h4 class="font-semibold">Reason</h4><p class="col-span-5">When the panel comes in contact with another object and impact is such that the original shape of the panel is deformed</p><h4 class="font-semibold">Our Solution</h4><p class="col-span-5">The dent is removed completely through an electronic dent puller with minimal impact on metal sheet strength. After dent removal, a fresh 3-coat matching paint is applied in a dust-free paint booth environment to bring back the panel to its factory-finish</p>`;
    }
    if (name === 'Remove all Scratches') {
      return `<h4 class="hidden font-semibold md:flex">Defect</h4><p class="hidden col-span-5 md:flex">Either paint fade, peel or chip in the panel</p><h4 class="font-semibold">Reason</h4><p class="col-span-5">When the panel comes in contact with another object and the impact is such that the complete clear coat, and/or base coat is removed</p><h4 class="font-semibold">Our Solution</h4><p class="col-span-5">The paint is completely removed from the impacted panel and a fresh 3-coat matching paint is applied in a dust-free paint booth environment to bring back the panel to its factory-finish</p>`;
    }
    if (name === 'Fix Severe Damage') {
      return `<h4 class="hidden font-semibold md:flex">Defect</h4><p class="hidden col-span-5 md:flex">When there is a tear in the sheet metal of the panel or damage which cannot be repaired through standard denting equipment</p><h4 class="font-semibold">Reason</h4><p class="col-span-5">When the contact of the car with the other object is substantial such that the damage is beyond repair</p><h4 class="font-semibold">Our Solution</h4><p class="col-span-5">The panels wherever the damage is such that it cannot be repaired we provide replacement with OEM/OES parts as per customer's preference. The new part is painted with a 3-coat system in a dust-free paint booth environment to match the color of the new part with the rest of the car body</p>`;
    }
    return null;
  };
  removeServiceFromCart = (serviceList: any) => {
    this.utilService.showSpinnerData = true;
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
  replaceServiceFromCart = (serviceList: any, type: string) => {
    const { orderMeta: orderMetaList, userId, status } = this.activeCartList;
    const { package: packageList } = orderMetaList;
    const updatedServiceListData = [...packageList];
    const packageListIndex =
      type === 'denting'
        ? packageList?.findIndex(
            (packageData: any) =>
              packageData?.carPanel?.partTypeId ===
              serviceList?.carPanel?.partTypeId
          )
        : packageList?.findIndex(
            (packageData: any) =>
              packageData?.categoryId === serviceList?.categoryId
          );
    if (packageListIndex !== -1) {
      /* if (type === 'denting') {
        packageList.splice(packageListIndex, 1);
        const typeofWorkdata = this.getPackageWorksTypes(
          serviceList?.typeOfWorkId,
          'typedata'
        );
        this.serviceAddToCart(serviceList, typeofWorkdata);
      }
    } */
      let updatedServiceList = {};
      if (type === 'denting') {
        const typeofWorkdata = this.getPackageWorksTypes(
          serviceList?.typeOfWorkId,
          'typedata'
        );
        const typeofWorkDetails = {
          name: typeofWorkdata.name,
          status: typeofWorkdata.status,
          price: serviceList.price,
          slashedPrice: serviceList.slashedPrice,
          addons: {},
        };
        updatedServiceList = {
          ...typeofWorkDetails,
          ...serviceList,
        };
        updatedServiceListData[packageListIndex] = {
          ...updatedServiceList,
        };
      } else {
        const priceAndOfferPriceList = this.packagePrice?.length
          ? this.packagePrice.filter(
              (packagePrice) => packagePrice.packageId === serviceList.id
            )
          : [];
        const priceAndOfferPrice = priceAndOfferPriceList?.length
          ? {
              price: priceAndOfferPriceList[0].price,
              slashedPrice: priceAndOfferPriceList[0].slashedPrice,
              fuelType: priceAndOfferPriceList[0].fuelType,
              modelId: priceAndOfferPriceList[0].modelId,
              cityId: priceAndOfferPriceList[0].cityId,
            }
          : { price: 0, slashedPrice: 0, fuelType: '', modelId: 0, cityId: 0 };
        updatedServiceList = {
          ...serviceList,
          ...priceAndOfferPrice,
        };
        this.selectedPackageList = updatedServiceList;
        this.filteredAddonList = this.addOnList.filter(
          (addOn) => addOn.packageId === serviceList.id
        );

        if (this.filteredAddonList?.length) {
          // this.displayAddOns = 'block';
          // this.display = 'flex';
          // this.showModal = true;
          if (this.modalAddOn) {
            this.modalAddOn.dispose();
          }
          this.modalAddOn = new window.bootstrap.Modal(
            document.getElementById('modalAddOn')
          );
          this.modalAddOn.show();
          this.filteredAddonList.map((addon) => (addon.selected = false));
          updatedServiceListData[packageListIndex] = {
            ...updatedServiceList,
          };
          const totalAmount = packageList?.length
            ? packageList
                ?.map(
                  (pack: any) =>
                    (pack?.slashedPrice
                      ? pack.slashedPrice
                      : pack.price
                      ? pack.price
                      : 0) +
                    (pack?.addons?.slashedPrice
                      ? pack.addons.slashedPrice
                      : pack.addons.price
                      ? pack.addons.price
                      : 0)
                )
                .reduce((a: number, b: number) => a + b)
            : 0;
          const orderMeta = {
            package: updatedServiceListData,
            totalAmount,
          };
          const params = {
            orderMeta,
            paymentTotal: totalAmount,
            status,
            userId,
          };
          this.replaceService = params;
          return;
        } else {
          this.replaceService = null;
        }
        updatedServiceListData[packageListIndex] = {
          ...updatedServiceList,
        };
      }
    }
    this.utilService.showSpinnerData = true;
    const totalAmount = packageList?.length
      ? packageList
          ?.map(
            (pack: any) =>
              (pack?.slashedPrice
                ? pack.slashedPrice
                : pack.price
                ? pack.price
                : 0) +
              (pack?.addons?.slashedPrice
                ? pack.addons.slashedPrice
                : pack.addons.price
                ? pack.addons.price
                : 0)
          )
          .reduce((a: number, b: number) => a + b)
      : 0;
    const orderMeta = {
      package: updatedServiceListData,
      totalAmount,
    };
    const params = {
      orderMeta,
      paymentTotal: totalAmount,
      status,
      userId,
    };
    this.addOrUpdateToCart(userId, params);
  };
  onButtonClicked = (event: boolean) => {
    if (event) {
      this.getActiveCartData();
      this.loadData();
      this.searchPackageList();
    }
  };

  loadDataNew = async () => {
    this.utilService.showSpinnerData = true;
    try {
      this.getAddOnList();
      // const loadModelResponse = await this.bookingService
      //   .getCarModels()
      //   .toPromise();
      // if (loadModelResponse) {
      //   this.modelsList = [];
      //   this.carsFiltered = [];
      //   loadModelResponse.map((car: any) => {
      //     const carDetail = {
      //       ...car,
      //       carModel: `${car.brand.name} ${car.name}`,
      //     };
      //     this.modelsList.push(carDetail);
      //     this.carsFiltered.push(carDetail);
      //   });
      // }
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
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };

  ngOnDestroy() {
    // Don't forget to unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
}

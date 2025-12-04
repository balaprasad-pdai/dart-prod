import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings-service';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-free-estimate1',
  templateUrl: './free-estimate1.component.html',
  styleUrls: ['./free-estimate1.component.css'],
})
export class FreeEstimate1Component implements OnInit {
  noDataFound: any;
  servicesListFiltered: any[] = [];
  activeCartList: any;
  selectedPanelList: any[] = [];
  typeOfWorkList: any[] = [];
  packageList: any[] = [];
  selectedPanelWorkList: any[] = [];
  orderParamsList: any;
  selectedPackageList: any = { addons: null };
  selectedCarModel: any;
  selectedCity = '';
  constructor(
    private bookingService: BookingsService,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    const selectedCarDetail = sessionStorage.getItem('selectedCar');
    this.selectedCarModel = selectedCarDetail
      ? JSON.parse(selectedCarDetail)
      : null;
    this.selectedCity = localStorage.getItem('cityName') || '';
    this.activeCartList = null;
    this.getActiveCartData('clear');
    this.loadData();
  }
  onButtonClicked = (event: boolean) => {
    if (event) {
      this.loadData();
      this.searchPackageList();
    }
  };
  loadData = () => {
    this.util.showSpinnerData = true;
    forkJoin([
      this.bookingService.getServiceCategory(),
      this.bookingService.getAllPackages(),
      this.bookingService.getTypeOfWork(),
    ]).subscribe(
      ([serviceResponse, packageListResponse, typeOfWorkList]) => {
        if (serviceResponse) {
          this.servicesListFiltered = serviceResponse.filter(
            (serciseCategory: any) =>
              serciseCategory?.name?.toLowerCase()?.includes('denting')
          );
          this.packageList = packageListResponse.filter((packageList: any) =>
            packageList.name?.toLowerCase()?.includes('denting')
          );

          this.panelPricing(this.servicesListFiltered);

          this.util.showSpinnerData = false;
        }
        if (typeOfWorkList?.length) {
          this.typeOfWorkList = typeOfWorkList?.filter(
            (typeOfWorkData: any) => typeOfWorkData.status === 'active'
          );
          this.util.showSpinnerData = false;
        }
      },
      (error) => {
        this.util.showSpinnerData = false;
      }
    );
  };
  panelPricing = async (packageList: any) => {
    this.util.showSpinnerData = true;
    const modelId = sessionStorage.getItem('modelId');
    const cityId = localStorage.getItem('cityId');
    const fuelType = sessionStorage.getItem('fuelType');
    const packageId = packageList.length ? packageList[0].id : null;
    try {
      const selectedPanelPrice = await this.bookingService
        .panelPriceLoading(modelId, cityId, fuelType, packageId)
        .toPromise();
      if (selectedPanelPrice) {
        this.selectedPanelList = [];

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
        });
      }
    } catch (error) {
      this.util.showSpinnerData = false;
    }
  };
  searchPackageList = () => {};
  getActiveCartData = async (updateCart: any = undefined) => {
    // this.utilService.showSpinnerData = true;

    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      try {
        const responseActiveCartList = await this.bookingService
          .getActiveCartService(userId)
          .toPromise();
        if (responseActiveCartList?.id) {
          this.activeCartList =
            updateCart !== 'clear' ? responseActiveCartList : null;

          if (updateCart === 'clear') {
            const { orderMeta, id, status, userId } = responseActiveCartList;
            const orderMetaData = {
              package: [],
              bookingType: 'free_estimate',
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
          } else if (updateCart) {
            const { orderMeta, id, status, userId } = responseActiveCartList;
            const { package: packageName } = orderMeta;
            const updatePackage = [...packageName, updateCart];
            let totalAmount = 0;
            updatePackage.map((packageList: any) => {
              if (packageList?.addons?.slashedPrice) {
                totalAmount += packageList.addons.slashedPrice;
              }
              totalAmount += packageList.slashedPrice;
            });
            const orderMetaData = {
              package: updatePackage,
              bookingType: 'free_estimate',
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
            this.util.showSpinnerData = false;
          }
        } else {
          if (updateCart) {
            const updatePackage = [updateCart];

            let totalAmount = 0;
            updatePackage.map((packageList: any) => {
              if (packageList?.addons?.slashedPrice) {
                totalAmount += packageList.addons.slashedPrice;
              }
              totalAmount += packageList.slashedPrice;
            });
            const orderMetaData = {
              package: updatePackage,
              bookingType: 'free_estimate',
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
            this.util.showSpinnerData = false;
          }
        }
      } catch (error) {
        this.util.showSpinnerData = false;
      }
    }
  };
  addOrUpdateToCart = async (userId: any, params: any) => {
    try {
      const addToCart = await this.bookingService
        .addToCartService(userId, params)
        .toPromise();
      if (addToCart?.id) {
        this.util.showSpinnerData = false;
        this.activeCartList = addToCart;
        if (addToCart?.orderMeta?.package?.length) {
          sessionStorage.setItem('cart', 'true');
        } else {
          sessionStorage.setItem('cart', 'false');
        }
      }
    } catch (error) {
      this.util.showSpinnerData = false;
    }
  };
  closeModal = () => {};
  getTypeOfWorkName = (typeWorkId: any) => {
    const typeOfWorkList = this.typeOfWorkList.filter(
      (typeWork) => typeWork.id === typeWorkId
    );
    return typeOfWorkList?.length ? typeOfWorkList[0].name : '';
  };
  getPanelSelected = (panelList: any, returnType: string) => {
    const isExistAmountSelectionList = this.selectedPanelWorkList.filter(
      (selectedPanelList: any) =>
        selectedPanelList?.id === panelList?.carPanel?.id
    );
    const isExistSelectionList = this.selectedPanelWorkList.filter(
      (selectedPanelList: any) =>
        selectedPanelList?.id === panelList?.carPanel?.id &&
        selectedPanelList?.typeOfWorkId === panelList?.typeOfWorkId
    );
    if (returnType === 'Amount') {
      return isExistAmountSelectionList?.length &&
        !isExistAmountSelectionList[0].noDamage
        ? isExistAmountSelectionList[0].amount
        : 0;
    } else {
      return isExistSelectionList?.length &&
        !isExistAmountSelectionList[0].noDamage
        ? true
        : false;
    }
  };
  getPanelNoDamageSelected = (panelList: any) => {
    const isExistAmountSelectionList: any[] = this.selectedPanelWorkList.filter(
      (selectedPanelList: any) =>
        selectedPanelList?.id === panelList?.panelId &&
        selectedPanelList.noDamage
    );
    return isExistAmountSelectionList?.length ? true : false;
  };
  selectServiceWork = (panelWorkList: any, isSelectNoDamage: boolean) => {
    const id = panelWorkList?.carPanel?.id ? panelWorkList.carPanel.id : null;
    const isExistSelectionList = this.selectedPanelWorkList.filter(
      (selectedPanelList: any) => selectedPanelList?.id !== id
    );
    const arrayList = {
      id: panelWorkList?.carPanel?.id,
      typeOfWorkId: panelWorkList?.typeOfWorkId || null,
      amount: panelWorkList?.slashedPrice || panelWorkList?.price,
      noDamage: isSelectNoDamage,
    };
    const replaceOrAddCart = this.selectedPanelWorkList.filter(
      (selectedPanelList: any) =>
        selectedPanelList?.id === panelWorkList?.panelId &&
        !selectedPanelList.noDamage
    );
    isExistSelectionList.push(arrayList);
    this.selectedPanelWorkList = [...isExistSelectionList];

    const typeOfWorkData = this.typeOfWorkList.filter(
      (workType: any) => workType.id === panelWorkList.typeOfWorkId
    );

    if (isSelectNoDamage) {
      this.removeServiceFromCart(panelWorkList);
    } else if (replaceOrAddCart?.length) {
      this.replaceServiceFromCart(panelWorkList, 'denting');
    } else {
      this.serviceAddToCart(panelWorkList, typeOfWorkData);
    }
  };
  removeServiceFromCart = (serviceList: any) => {
    this.util.showSpinnerData = true;
    const { orderMeta: orderMetaList, userId, status } = this.activeCartList;
    const { package: packageList } = orderMetaList;
    const params = this.removeServiceFilterFromCart(
      serviceList,
      packageList,
      userId,
      status
    );
    this.addOrUpdateToCart(userId, params);
  };
  serviceAddToCart = async (service: any, typeofWorkdata: any = undefined) => {
    this.util.showSpinnerData = true;
    const loggedIn = localStorage.getItem('loggedIn');
    const brandId = sessionStorage.getItem('brandId');
    const cityId = localStorage.getItem('cityId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');
    if (!loggedIn) {
      if (!cityId || !brandId || !modelId || !fuelType) {
        this.util.showModelSelectModal = true;
      } else {
        this.util.showLoginModal = true;
      }
      return;
    }
    this.util.showSpinnerData = false;
    if (typeofWorkdata) {
      const typeofWorkDetails = {
        name: typeofWorkdata?.length ? typeofWorkdata[0].name : '',
        status: typeofWorkdata?.length ? typeofWorkdata[0].status : '',
        price: service.price,
        slashedPrice: service.slashedPrice,
      };

      const updatedServiceList = {
        ...typeofWorkDetails,
        ...service,
      };
      this.selectedPackageList = updatedServiceList;
    }

    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      /* Addons */
      this.selectedPackageList.addons = {};
      if (typeofWorkdata) {
        this.getActiveCartData(this.selectedPackageList);
      } else {
        this.getActiveCartData(this.selectedPackageList);
      }
    } else {
      this.util.headerShowModal = 1;
    }
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
      const typeOfWorkData = this.typeOfWorkList.filter(
        (workType: any) => workType?.id === serviceList?.typeOfWorkId
      );
      const typeofWorkDetails = {
        name: typeOfWorkData?.length ? typeOfWorkData[0].name : '',
        status: typeOfWorkData?.length ? typeOfWorkData[0].status : null,
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
    }
    this.util.showSpinnerData = true;
    const totalAmount = packageList?.length
      ? packageList
          ?.map(
            (pack: any) =>
              (pack?.slashedPrice ? pack.slashedPrice : 0) +
              (pack?.addons?.slashedPrice ? pack.addons.slashedPrice : 0)
          )
          .reduce((a: number, b: number) => a + b)
      : 0;

    const orderMeta = {
      package: updatedServiceListData,
      bookingType: 'free_estimate',
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
  removeServiceFilterFromCart = (
    serviceList: any,
    packageList: any[],
    userId: any,
    status: any
  ) => {
    const finalPackageList = packageList?.filter(
      (packageData: any) => packageData?.panelId !== serviceList?.panelId
    );
    const totalAmount = finalPackageList?.length
      ? finalPackageList
          ?.map(
            (pack: any) =>
              (pack?.slashedPrice ? pack.slashedPrice : 0) +
              (pack?.addons?.slashedPrice ? pack.addons.slashedPrice : 0)
          )
          .reduce((a: number, b: number) => a + b)
      : 0;
    const orderMeta = {
      package: finalPackageList,
      totalAmount,
    };
    return {
      orderMeta,
      paymentTotal: totalAmount,
      status,
      userId,
    };
  };
}

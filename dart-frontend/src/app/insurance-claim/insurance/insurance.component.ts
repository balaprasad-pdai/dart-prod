import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from 'src/app/bookings/bookings-service';
import { DentTypes } from 'src/app/constants/insurance-types';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  // dentTypes = DentTypes;
  dentTypes: any[] = [];
  activeCartList: any;
  selectedPackageList: any = {};
  fromInsurance = true;
  

  constructor(
    private bookingService: BookingsService,
    public utilService: UtilService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.getDentTypes();
    this.getActiveCartData();
    console.log(this.router.url);
    console.log('this.router.url.indexOf(', this.router.url.indexOf('non-insurance'));
    if(this.router.url.indexOf('non-insurance') != -1){
      this.fromInsurance = false;
    }
  }

  async getDentTypes(){
    const packageResponse = await this.bookingService
    .getAllPackages('', 'body-and-paint-repairs')
    .toPromise();
    this.dentTypes = packageResponse;
    this.dentTypes.forEach((d:any)=>{
      d.isOpen = false;
      d.packageMetaData.forEach((e:any) => {
        e.selected = false;
      });
    })
  }

  openAccordion(dentType: any, idx: number){
    this.dentTypes.forEach((d, index) => {
      if(idx!==index){
        d.isOpen = false
      }
    });
    dentType.isOpen = !dentType.isOpen;
  }

  addToCart(type: any, mainType: any, idx: number){
    // this.dentTypes[idx].types[type.id].selected = true;
    type.selected = !type.selected;
    // this.activeCartList.push(mainType)
    this.serviceAddToCart(mainType)
    // sessionStorage.setItem('insuranceList', JSON.stringify(this.activeCartList))
  }

  removeFromCart(type: any, idx: number){
    // this.dentTypes[idx].types[type.id].selected = true;
    type.selected = !type.selected;
    // const index = this.activeCartList.findIndex((cart) => type.title == cart.title);
    // this.activeCartList.splice(index, 1);
  }

  getCartList(){
  //   const addToCart = await this.bookingService
  //   .addToCartService(userId, params)
  //   .toPromise();
  // if (addToCart?.id) {
  //   this.utilService.showSpinnerData = false;
  //   this.activeCartList = addToCart;
  }

  onButtonClicked = (event: boolean) => {
    if (event) {
      // this.getActiveCartData();
      // this.loadData();
      // this.searchPackageList();
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
              paymentTotal: 0,
              status,
              userId
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

  addOrUpdateToCart = async (userId: any, params: any) => {
    try {
      const addToCart = await this.bookingService
        .addToCartService(userId, params)
        .toPromise();
      if (addToCart?.id) {
        this.utilService.showSpinnerData = false;
        this.activeCartList = addToCart;
        console.log('this.activeCartList--', this.activeCartList);
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

  closeModal = () => {
    // this.modalAddOn.hide();
    // this.filteredAddonList.map((addon) => (addon.selected = false));
  };

  // removeServiceFromCart = (serviceList: any) => {
  //   this.utilService.showSpinnerData = true;
  //   const { orderMeta: orderMetaList, userId, status } = this.activeCartList;
  //   const { package: packageList } = orderMetaList;
  //   const params = this.bookingService.removeServiceFromCart(
  //     serviceList,
  //     packageList,
  //     userId,
  //     status
  //   );
  //   this.addOrUpdateToCart(userId, params);
  // };

  serviceAddToCart = async (service: any) => {
    this.utilService.showSpinnerData = true;
    const loggedIn = localStorage.getItem('loggedIn');
    const brandId = sessionStorage.getItem('brandId');
    const cityId = localStorage.getItem('cityId');
    const modelId = sessionStorage.getItem('modelId');
    const fuelType = sessionStorage.getItem('fuelType');
    if (!loggedIn) {
      if (!cityId || !brandId || !modelId || !fuelType) {
        this.utilService.showModelSelectModal = true;
      } else {
        this.utilService.showLoginModal = true;
      }
      return;
    }
    const updatedServiceList = {
      ...service,
    };
    this.selectedPackageList = updatedServiceList;
    if (loggedIn) {
      const userId = localStorage.getItem('customerId');
      /* Addons */
        this.getActiveCartData(this.selectedPackageList);
    } else {
      this.utilService.headerShowModal = 1;
    }
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

  // addOrUpdateToCart = async (userId: any, params: any) => {
  //   try {
  //     const addToCart = await this.bookingService
  //       .addToCartService(userId, params)
  //       .toPromise();
  //     if (addToCart?.id) {
  //       this.activeCartList = addToCart;
  //       if (addToCart?.orderMeta?.package?.length) {
  //         sessionStorage.setItem('cart', 'true');
  //       } else {
  //         sessionStorage.setItem('cart', 'false');
  //       }
  //       this.buttonClicked.emit(true);
  //     }
  //   } catch (error) {}
  // };
  
}

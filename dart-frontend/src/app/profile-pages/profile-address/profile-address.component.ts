import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileAddressService } from './profile-address.service';
import { DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UtilService } from 'src/app/util.service';
import { LoginService } from 'src/app/header/login-service';
import { forkJoin } from 'rxjs';
declare let window: any;

@Component({
  selector: 'app-profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css'],
  providers: [ProfileAddressService, DecimalPipe],
})
export class ProfileAddressComponent {
  addressAddForm!: UntypedFormGroup;
  activeStatus = true;
  submitted = false;
  modalRef: any;
  content: any;
  addressList: any[] = [];
  // statusBoolean!: boolean[];
  states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra & Nagar Haveli and Daman & Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Lakshadweep',
    'Puducherry',
    'Ladakh',
  ];
  citiesList: any[] = [];
  filteredCityList: any[] = [];
  selectedAddressType: any;
  modalAddress!: any;
  addressType = [
    { id: 1, type: 'Home' },
    { id: 2, type: 'Work' },
    { id: 3, type: 'Other' },
  ];
  @Input() cartPageList: boolean = false;
  @Output() addressSelection = new EventEmitter<any>();
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    public service: ProfileAddressService,
    public util: UtilService,
    public headerService: LoginService
  ) {}

  ngOnInit(): void {
    this.addressAddForm = this.fb.group({
      ids: [''],
      number: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      city: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      landmark: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ,.-]+$')],
      ],
      addressType: [1],
      // status: [''],
      stateName: ['', [Validators.required]],
    });

    this.loadAddress();
  }
  ngDoCheck() {
    const modalOpen = this.util.showAddressModal;
    if (modalOpen == true) {
      this.selectedAddressType = 1;
      this.submitted = false;
      this.openModalShow('modalAddress');
      this.util.showAddressModal = false;
    }
  }
  openModalShow = (element: string) => {
    if (element === 'modalAddress') {
      if (this.modalAddress) {
        this.modalAddress.dispose();
      }
      this.modalAddress = new window.bootstrap.Modal(
        document.getElementById('ModalAdd_Address')
      );
      this.modalAddress.show();
    }
  };
  closeModal = () => {
    this.util.showAddressModal = false;
    this.modalAddress.hide();
    this.addressAddForm.reset();
  };

  openModal = () => {
    this.util.showAddressModal = true;
  };

  get form() {
    return this.addressAddForm.controls;
  }

  saveAddress = async () => {
    this.submitted = true;

    if (this.addressAddForm.valid) {
      this.util.showSpinnerData = true;

      const {
        number,
        email,
        name,
        city,
        address1,
        landmark,
        addressType,
        status,
        stateName,
      } = this.addressAddForm.value;
      const userId = localStorage.getItem('customerId');
      const params = {
        status: this.activeStatus ? 'active' : 'inactive',
        name,
        address: {
          city,
          stateName,
          address1,
          landmark,
          number,
          email,
        },
        addressType: addressType ? addressType : 1,
        userId: Number(userId),
      };
      if (this.form['ids']?.value) {
        try {
          const updateAddressResponse = await this.service
            .updateAddressDetail(params, this.form['ids'].value)
            .toPromise();
          if (updateAddressResponse) {
            this.util.showAddressModal = false;
            this.modalAddress.hide();
            this.loadAddress();
            this.addressAddForm.reset();
          }
        } catch (error) {
          this.util.showSpinnerData = false;
        }
      } else {
        try {
          const saveAddressResponse = await this.service
            .saveAddress(params)
            .toPromise();

          if (saveAddressResponse) {
            this.util.showAddressModal = false;
            this.modalAddress.hide();
            this.loadAddress();
            this.addressAddForm.reset();
          }
        } catch (error) {
          this.util.showSpinnerData = false;
        }
      }
    }
  };
  editDataGet = async (singleAddressDetails: any) => {
    // try {
    //   const singleAddressDetails = await this.service
    //     .getSelectedAddressDetail(id)
    //     .toPromise();
    //   if (singleAddressDetails) {
    this.addressAddForm.get('ids')?.setValue(singleAddressDetails?.id);
    this.addressAddForm.get('name')?.setValue(singleAddressDetails?.name);
    this.addressAddForm
      .get('number')
      ?.setValue(singleAddressDetails?.address?.number);
    this.addressAddForm
      .get('email')
      ?.setValue(singleAddressDetails?.address?.email);
    this.addressAddForm
      .get('city')
      ?.setValue(singleAddressDetails?.address?.city);
    this.addressAddForm
      .get('address1')
      ?.setValue(singleAddressDetails?.address?.address1);
    this.addressAddForm
      .get('landmark')
      ?.setValue(singleAddressDetails?.address?.landmark);
    this.addressAddForm
      .get('addressType')
      ?.setValue(singleAddressDetails?.addressType);
    this.addressAddForm
      .get('stateName')
      ?.setValue(singleAddressDetails?.address?.stateName);
    this.selectedAddressType = singleAddressDetails?.addressType;

    // this.activeStatus =
    //   singleAddressDetails?.status === 'active' ? true : false;
    this.submitted = false;
    this.openModalShow('modalAddress');
    //   }
    // } catch (error) {

    // }
  };
  // editDataGet = async (id: any, content: any) => {

  //   try {
  //     const singleAddressDetails = await this.service
  //       .getSelectedAddressDetail(id)
  //       .toPromise();
  //     if (singleAddressDetails) {
  //       this.addressAddForm.get('ids')?.setValue(singleAddressDetails?.id);
  //       this.addressAddForm.get('name')?.setValue(singleAddressDetails?.name);
  //       this.addressAddForm
  //         .get('number')
  //         ?.setValue(singleAddressDetails?.number);
  //       this.addressAddForm.get('email')?.setValue(singleAddressDetails?.email);
  //       this.addressAddForm.get('city')?.setValue(singleAddressDetails?.city);
  //       this.addressAddForm
  //         .get('address1')
  //         ?.setValue(singleAddressDetails?.address1);
  //       this.addressAddForm
  //         .get('landmark')
  //         ?.setValue(singleAddressDetails?.landmark);
  //       this.addressAddForm
  //         .get('addressType')
  //         ?.setValue(singleAddressDetails?.addressType);
  //       this.addressAddForm
  //         .get('stateName')
  //         ?.setValue(singleAddressDetails?.stateName);

  //       // this.activeStatus =
  //       //   singleAddressDetails?.status === 'active' ? true : false;
  //       this.submitted = false;
  //       this.util.showAddressModal = true;
  //     }
  //   } catch (error) {

  //   }
  // };

  delete = async (id: any) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true,
      })
      .then(async (result: any) => {
        if (result.value) {
          try {
            const deletedCity = await this.service
              .deleteAddress(id)
              .toPromise();
            if (deletedCity) {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your data has been deleted.',
                'success'
              );
              this.loadAddress();
            }
          } catch (error) {}
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your data is safe :)',
            'error'
          );
        }
      });
  };

  loadAddress = () => {
    this.util.showSpinnerData = true;

    const userId = localStorage.getItem('customerId');
    if (!userId) {
      /* this.headerService.showModal = 5; */
      return;
    }

    forkJoin([
      this.headerService.getCityNames(),
      this.service.getAddress(userId),
    ]).subscribe(
      ([cityResponse, userAddressResponse]) => {
        if (userAddressResponse?.length) {
          this.addressList = userAddressResponse;
        }
        this.citiesList = cityResponse?.filter(
          (city: any) => city.status === 'active'
        );
        this.util.showSpinnerData = false;
      },
      (error) => {
        this.util.showSpinnerData = false;
      }
    );
  };

  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };

  saveAddressType(address: any) {
    this.selectedAddressType = address.id;
    this.addressAddForm.patchValue({
      addressType: address.id,
    });
  }
  addressSelect = (address: any) => {
    this.addressList?.map((address) => (address.active = false));
    address.active = true;
    this.addressSelection.emit(address);
  };
  changeState = () => {
    const { stateName } = this.addressAddForm.value;
    const cityList = this.citiesList.filter(
      (city) => city.stateName === stateName
    );
    this.filteredCityList = cityList;
  };
}

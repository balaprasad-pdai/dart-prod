import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ProfileService } from 'src/app/profile-pages/profile/profile.service';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-free-estimate',
  templateUrl: './free-estimate.component.html',
  styleUrls: ['./free-estimate.component.css'],
})
export class FreeEstimateComponent implements OnInit {
  selectedCarModel: any;
  selectedCity = '';
  fuelType = '';
  value = [
    {
      question: 'Why should I choose DART in Bangalore?',
      answer:
        'DART is the best one-stop shop for all your car repair and car servicing requirements in Bangalore. We provide a wide range of cost efficient car services along with several added benefits like free pick up & drop, live tracking, etc. We also offer genuine spare parts and accessories to ensure the highest quality of car services to our customers.',
    },

    {
      question:
        'What kind of car services does DART service center offer in Bangalore?',
      answer:
        'At DART Bangalore, we offer a wide range of services including Car Tyre Replacement, Car Battery Replacement, Bumper Painting, Dent Repair, Denting and Painting, Car Dent Removal, Periodic Car Servicing, Scratch Removal for Cars, Car Deep Scratch Removal, Car Engine Repair, Car A/C Repair, etc.',
    },
    {
      question: 'Will I know the cost of servicing my vehicle beforehand?',
      answer:
        'At DART, We give you a detailed breakdown in advance of all the work and time involved. So you know exactly what everything will cost right from the start. Along with that we always check with you first before performing any extra work.',
    },
    {
      question: 'How can I book a car service appointment in Bangalore',
      answer:
        'It is extremely easy to book a car service appointment in Bangalore. All you need to do is visit the DART website, choose Bangalore from our location option, select the desired service, checkout the service by giving the necessary information and we will pick your car. It is that simple. You can also call us at +91 931-981-3005 and our customer service experts will get back to you.',
    },
    {
      question: 'What makes DART the best car repair garage in Bangalore?',
      answer:
        'DART is the best and most reliable car service center near you in Bangalore. We promise you 100% Satisfaction. Hassle-Free experience, Transparency and Multiple Quality checks to ensure we provide the best service possible. You can find us online on our website and book your car servicing slot instantly to have a convenient and hassle-free car servicing experience in Bangalore.',
    },
  ];

  dropDown = new Array(5).fill(false);

  constructor(
    public util: UtilService,
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.selectedCity = localStorage.getItem('cityName') || '';
    this.dropDown.fill(false, 5);
  }
  ngDoCheck() {
    const selectedCarDetail = sessionStorage.getItem('selectedCar');
    this.selectedCarModel = selectedCarDetail
      ? JSON.parse(selectedCarDetail)
      : 'Select Car model';
    this.fuelType = sessionStorage.getItem('fuelType') || '';
  }

  onclick(ind: any) {
    this.dropDown[ind] = !this.dropDown[ind];
  }
  changeCarDetail = () => {
    sessionStorage.removeItem('brandId');
    sessionStorage.removeItem('modelId');
    sessionStorage.removeItem('fuelType');
    this.util.showModelSelectModal = true;
  };
  onFileSelectedView = (event: any, fileIndex: Number) => {
    const file: File = event.target.files[0];

    if (file) {
      if (fileIndex === 0) {
        this.util.selectedFile[0] = file;
      } else if (fileIndex === 1) {
        this.util.selectedFile[1] = file;
      } else if (fileIndex === 2) {
        this.util.selectedFile[2] = file;
      } else if (fileIndex === 3) {
        this.util.selectedFile[3] = file;
      }

      // Display image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (fileIndex === 0) {
          this.util.selectedFileUrl[0] = e.target.result;
        } else if (fileIndex === 1) {
          this.util.selectedFileUrl[1] = e.target.result;
        } else if (fileIndex === 2) {
          this.util.selectedFileUrl[2] = e.target.result;
        } else if (fileIndex === 3) {
          this.util.selectedFileUrl[3] = e.target.result;
        }
      };

      reader.readAsDataURL(file);
    }
  };
  getEstimate = () => {
    if (
      !this.util.selectedFile[0] ||
      !this.util.selectedFile[1] ||
      !this.util.selectedFile[2] ||
      !this.util.selectedFile[3]
    ) {
      this.toastr.error('Please upload images');
    } else {
      this.fileUpload();
    }
  };
  fileUpload = () => {
    const form1 = new FormData();
    form1.append('file', this.util.selectedFile[0]);
    const form2 = new FormData();
    form2.append('file', this.util.selectedFile[1]);
    const form3 = new FormData();
    form3.append('file', this.util.selectedFile[2]);
    const form4 = new FormData();
    form4.append('file', this.util.selectedFile[3]);
    const returnFileUrls: any[] = [];
    forkJoin([
      this.profileService.uploadFile(form1),
      this.profileService.uploadFile(form2),
      this.profileService.uploadFile(form3),
      this.profileService.uploadFile(form4),
    ]).subscribe(
      ([
        fileUploadResponse1,
        fileUploadResponse2,
        fileUploadResponse3,
        fileUploadResponse4,
      ]) => {
        if (fileUploadResponse1?.mediaId) {
          returnFileUrls[0] = `${this.util.getBaseUrl()}${
            fileUploadResponse1.mediaId
          }`;
        }
        if (fileUploadResponse2?.mediaId) {
          returnFileUrls[1] = `${this.util.getBaseUrl()}${
            fileUploadResponse2.mediaId
          }`;
        }
        if (fileUploadResponse3?.mediaId) {
          returnFileUrls[2] = `${this.util.getBaseUrl()}${
            fileUploadResponse3.mediaId
          }`;
        }
        if (fileUploadResponse4?.mediaId) {
          returnFileUrls[3] = `${this.util.getBaseUrl()}${
            fileUploadResponse4.mediaId
          }`;
        }
        sessionStorage.setItem('estimate', JSON.stringify(returnFileUrls));
        this.util.navigateToUrl('free-estimate-services');
      },
      (error) => {
        this.toastr.error(
          'File upload error, Please try again after some time.'
        );
      }
    );
  };
}

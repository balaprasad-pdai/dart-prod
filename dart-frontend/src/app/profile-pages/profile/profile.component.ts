import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/header/login-service';
import { ProfileService } from './profile.service';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService],
})
export class ProfileComponent implements OnInit {
  profileForm!: UntypedFormGroup;
  Username: any;
  data: any;
  upload = false;
  // upload: boolean;
  image: any;
  file: any;
  item: any;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private service: ProfileService,
    private fb: UntypedFormBuilder,
    public headerService: LoginService
  ) {}

  ngOnInit(): void {
    // Retrieve data from local storage

    this.userDataGet();

    this.upload = true;

    this.profileForm = this.fb.group({
      mobile: [''],
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      photoUrl: [''],
    });
  }
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };

  get form() {
    return this.profileForm.controls;
  }

  userDataGet = async () => {
    this.utilService.showSpinnerData = true;
    const id = localStorage.getItem('customerId');
    try {
      if (id && id !== '') {
        const profileDetails = await this.service
          .getSelectedProfileDetail(id)
          .toPromise();
        if (profileDetails) {
          if (profileDetails?.username) {
            const mobile = this.getAtob(profileDetails.username);
            this.profileForm.get('mobile')?.setValue(mobile);
          }

          if (profileDetails?.name !== 'Guest') {
            this.profileForm.get('name')?.setValue(profileDetails?.name);
          }
          this.profileForm.get('photoUrl')?.setValue(profileDetails?.photoUrl);
        }
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };
  onAccept(file: any) {
    this.utilService.showSpinnerData = true;

    this.image = file.name;
    this.file = file;
    const files = file.currentTarget.files[0];
    const form = new FormData();
    form.append('file', files);
    this.service.uploadFile(form).subscribe(
      (res: any) => {
        if (res?.mediaId) {
          const uploadFilePath = this.utilService.getBaseUrl() + res.mediaId;
          this.profileForm.get('photoUrl')?.setValue(uploadFilePath);
          this.utilService.showSpinnerData = false;
        }
      },
      (error) => {}
    );
  }

  removeImage() {
    this.upload = true;
    this.image = '';
    this.file = '';
  }

  getAtob = (username: any) => {
    return username ? atob(username) : '-';
  };

  updateProfile = async () => {
    this.utilService.showSpinnerData = true;
    if (this.profileForm.valid) {
      const id = localStorage.getItem('customerId') || '';
      const { name, photoUrl } = this.profileForm.value;
      const params = {
        name,
        photoUrl,
      };
      const updateProfileResponse = await this.service
        .updateProfileDetail(params, id)
        .toPromise();
      if (updateProfileResponse) {
      }
    }
    this.utilService.showSpinnerData = false;
  };
}

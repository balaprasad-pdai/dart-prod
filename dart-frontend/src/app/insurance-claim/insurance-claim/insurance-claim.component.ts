import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BlogsService } from 'src/app/blog-pages/blogs/blogs.service';
import { LoginService } from 'src/app/header/login-service';
declare let window: any;

@Component({
  selector: 'app-insurance-claim',
  templateUrl: './insurance-claim.component.html',
  styleUrls: ['./insurance-claim.component.css'],
})
export class InsuranceClaimComponent implements OnInit {
  testimonialOptions!: OwlOptions;
  blogsList: any[] = [];
  blogcategory: any[] = [];
  insuranseProviderList: any[] = [];
  blogsOptions!: OwlOptions;
  selecetdInsurance = -1;
  loggedIn = false;
  

  constructor(
    private router: Router,
    private blogService: BlogsService,
    private loginService: LoginService
    ) {}

  ngOnInit(): void {
    this.insuranseProviderList = [
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
      {
        id: 17,
        name: 'Shriram General Insurance',
        link: 'Shriram-General-Insurance.pdf',
      },
      { id: 18, name: 'Reliance General', link: 'Reliance-General.pdf' },
      { id: 19, name: 'United India', link: 'United-India.pdf' },
      { id: 20, name: 'New India Assurance', link: 'New-India-Assurance.xls' },
    ];
    const prevArrow = `<span aria-label="Previous" class="prev_btn"><i class="ti ti-arrow-left"></span>`;
    const nextArrow = `<span aria-label="Next" class="next_btn"><i class="ti ti-arrow-right"></span>`;
    this.testimonialOptions = {
      loop: true,
      margin: 10,
      nav: true,
      items: 1,
      navText: [prevArrow, nextArrow],
    };
    this.loggedIn =
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') == 'true'
        ? true
        : false;
    this.loadBlogCategory();
  }
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
                items: 1.3,
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
  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };
  navigateToUrl = (url: any) => {
    this.loggedIn =
    localStorage.getItem('loggedIn') &&
    localStorage.getItem('loggedIn') == 'true'
      ? true
      : false;
    if(this.loggedIn){
      this.router.navigate([url]);
    } else{
      this.loginService.announceLogin('login');
    }
  };
  downloadInsuranceClaim = () => {
    debugger;
    const link = document.createElement('a');
    const selectedInsuranceList = this.insuranseProviderList.filter(
      (insurance) => insurance.id === Number(this.selecetdInsurance)
    );
    if (selectedInsuranceList?.length) {
      link.href = `https://dart.repair/booking-service/api/uploads/${selectedInsuranceList[0].link}`;
      link.target = '_blank'; // Open in a new tab/window
      link.download = selectedInsuranceList[0].link; // Specify the desired file name
      document.body.appendChild(link);
      link.click();
      // Clean up
      document.body.removeChild(link);
    }
  };

}

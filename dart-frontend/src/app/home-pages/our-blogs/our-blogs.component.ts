import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-our-blogs',
  templateUrl: './our-blogs.component.html',
  styleUrls: ['./our-blogs.component.css']
})
export class OurBlogsComponent {
  // blogsOptions!: OwlOptions;
  // blogsList: any[] = [];
  @Input() blogsList: any;
  @Input() blogcategory: any;
  @Input() blogsOptions: any;
  
  // blogsList = [
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/1.png',
  //     service: 'Service',
  //     postedDate: 'May 30, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/2.png',
  //     service: 'Service',
  //     postedDate: 'May 30, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/3.png',
  //     service: 'Service',
  //     postedDate: 'May 31, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/1.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2022',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/2.png',
  //     service: 'Service',
  //     postedDate: 'Jul 13, 2022',
  //   },
  // ];
  constructor(
    private router: Router
  ){}
  ngOnInit(){
    // this.blogsOptions = {
    //   loop: true,
    //   mouseDrag: true,
    //   touchDrag: true,
    //   pullDrag: false,
    //   dots: false,
    //   navSpeed: 700,
    //   navText: ['&lsaquo;', '&rsaquo;'],
    //   margin: 5,
    //   responsive: {
    //     0: {
    //       items: 2.3,
    //     },
    //     400: {
    //       items: 2.3,
    //     },
    //     600: {
    //       items: 2.3,
    //     },
    //     740: {
    //       items: 2.3,
    //     },
    //     940: {
    //       items: 3.2,
    //     },
    //     1200: {
    //       items: 3.2,
    //     },
    //   },
    //   nav: true,
    // };
  }
  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };
  navigateToUrl = (url: any) => {
    this.router.navigate([url]);
  };
  goToDetailsPage = (id: any) => {
    localStorage.setItem('blogId', id);
    this.router.navigate(['blogs/details']);
  };
  getCategoryName = (id: any) => {
    const category = this.blogcategory.filter(
      (category: any) => category.id == id
    );
    return category.length ? category[0].name : '-';
  };
}

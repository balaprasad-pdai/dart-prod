import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import sal from 'sal.js';
import { BlogDetailsService } from './blog-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
  providers: [BlogDetailsService, DecimalPipe],
})
export class BlogDetailsComponent {
  blogsOptions!: OwlOptions;
  blog!: any;
  blogId!: any;
  newBlog!: any;
  blogcategory: any[] = [];
  blogsList: any[] = [];
  // blogsList = [
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/1.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/2.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/3.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/1.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2023',
  //   },
  //   {
  //     name: 'How to spark innovative collaboration on teams',
  //     icon: '../../assets/images/blog/2.png',
  //     service: 'Service',
  //     postedDate: 'Jun 20, 2023',
  //   },
  // ];
  constructor(private service: BlogDetailsService, private router: Router) {}
  ngOnInit() {
    this.blogId = localStorage.getItem('blogId');
    sal();
    this.loadServices();
    this.loadBlogCategory();
    this.loadBlogDetails(this.blogId);
  }
  loadServices = async () => {
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
          items: 2.3,
        },
        400: {
          items: 2.3,
        },
        600: {
          items: 2.3,
        },
        740: {
          items: 2.3,
        },
        940: {
          items: 3.5,
        },
        1200: {
          items: 4.5,
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

  loadBlogDetails = async (id: any) => {
    try {
      const loadBlogResponse = await this.service
        .getSelectedBlogsList(id)
        .toPromise();
      if (loadBlogResponse) {
        this.blog = loadBlogResponse;
        this.loadBlogByCategory(this.blog.categoryId);
      }
    } catch (error) {}
  };

  loadBlogCategory = async () => {
    try {
      const loadBlogCategoryResponse = await this.service
        .getBlogCategory()
        .toPromise();
      if (loadBlogCategoryResponse) {
        this.blogcategory = loadBlogCategoryResponse;
      }
    } catch (error) {}
  };

  loadBlogByCategory = async (id: any) => {
    try {
      const loadBlogCategoryResponse = await this.service
        .getBlogByCategory(id)
        .toPromise();
      if (loadBlogCategoryResponse) {
        this.blogsList = loadBlogCategoryResponse;
      }
    } catch (error) {}
  };

  getCategoryName = (id: any) => {
    const category = this.blogcategory.filter((category) => category.id == id);
    return category.length ? category[0].name : '-';
  };

  viewAll = () => {
    this.router.navigate(['/blogs']);
  };

  goToDetailsPage = async (id: any) => {
    if (this.blogId !== id) {
      // Update localStorage with the new id
      localStorage.setItem('blogId', id);
    
      // If the blogId has changed, load the details of the selected blog
      this.loadBlogDetails(id);
    }
    
  };
}

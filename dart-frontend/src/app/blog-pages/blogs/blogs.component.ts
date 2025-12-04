import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogsService } from './blogs.service';
import { DecimalPipe } from '@angular/common';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
  providers: [BlogsService, DecimalPipe],
})
export class BlogsComponent {
  categories = ['All', 'Painting', 'Insurance', 'AC Service'];
  activeCategory = 'All';
  blog: any[] = [];
  blogcategory: any[] = [];
  blogsFiltered: any[] = [];
  selectedCategoryId: any | null = null;
  page = 1;
  itemsPerpage = 9;

  constructor(private service: BlogsService, private router: Router,public utilService: UtilService) {}
  ngOnInit() {
    this.loadBlogsList();
    this.loadBlogCategory();
  }

  loadBlogCategory = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const loadBlogCategoryResponse = await this.service
        .getBlogCategory()
        .toPromise();
      if (loadBlogCategoryResponse) {
        this.blogcategory = loadBlogCategoryResponse;
        this.utilService.showSpinnerData = false;
      }
    } catch (error) {
      this.utilService.showSpinnerData = false;
    }
  };

  loadBlogsList = async () => {
    this.utilService.showSpinnerData = true;
    try {
      const loadBlogResponse = await this.service.getBlogsList().toPromise();
      if (loadBlogResponse) {
        this.blog = loadBlogResponse;
        this.blogsFiltered = loadBlogResponse
        this.utilService.showSpinnerData = false;
        
      }
    } catch (error) { this.utilService.showSpinnerData = false;}
  };

  getCategoryName = (id: any) => {
    const category = this.blogcategory.filter((category) => category.id == id);
    return category.length ? category[0].name : '-';
  };

  goToDetailsPage = (id: any) => {
    localStorage.setItem('blogId', id);
    this.router.navigate(['blogs/details']);
  };

  selectAll() {
    this.selectedCategoryId = null;
    this.loadBlogsList();
  }

  getFilterName = (id: any) => {
    this.selectedCategoryId = id;
    this.blogsFiltered = this.blog.filter((item) => item.categoryId == id);
    this.page=1
  };
}


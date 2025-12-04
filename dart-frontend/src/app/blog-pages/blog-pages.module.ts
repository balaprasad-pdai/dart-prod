import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPagesRoutingModule } from './blog-pages-routing.module';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderModule } from '../header/header.module';
import { HomePagesModule } from '../home-pages/home-pages.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    BlogsComponent,
    BlogDetailsComponent
  ],
  imports: [
    CommonModule,
    BlogPagesRoutingModule,
    CarouselModule,
    HeaderModule,
    HomePagesModule,
    NgxPaginationModule
  ]
})
export class BlogPagesModule { }

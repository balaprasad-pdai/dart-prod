import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePagesRoutingModule } from './home-pages-routing.module';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CancellationRefundPrivacyPolicyComponent } from './cancellation-refund-privacy-policy/cancellation-refund-privacy-policy.component';
import { OurProcessComponent } from './our-process/our-process.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { OurBlogsComponent } from './our-blogs/our-blogs.component';
import { FaqComponent } from './faq/faq.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    CancellationRefundPrivacyPolicyComponent,
    OurProcessComponent,
    TestimonialsComponent,
    OurBlogsComponent,
    FaqComponent,
    WhyChooseUsComponent,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    HomePagesRoutingModule,
    CarouselModule,
    FormsModule,
    HeaderModule,
  ],
  exports: [
    FooterComponent,
    OurProcessComponent,
    TestimonialsComponent,
    OurBlogsComponent,
    FaqComponent,
    WhyChooseUsComponent,
  ],
})
export class HomePagesModule {}

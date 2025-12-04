import { Component } from '@angular/core';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  footerLinks1 = [
    { name: 'Gallery', link: '/gallery', action: false },
    { name: 'About', link: 'about-us/details', action: false },
    { name: 'Terms of use', link: '/terms-of-use', action: false },
    { name: 'Privacy Policy', link: '/privacy-policy', action: false },
    {
      name: 'Cancellation & Refund Policy',
      link: '/refund-policy',
      action: false,
    },
    { name: 'Blogs', link: '/blogs', action: false },
  ];
  footerLinks2 = [
    { name: 'Services', link: '/bookings', action: false },
    { name: 'Insurance Claims', link: '/insurance-claim', action: false },
    { name: 'Free Estimate', link: '/free-estimate', action: false },
  ];
  constructor(public util: UtilService) {}
  ngOnInit() {}
  navigateUrl = (list: any) => {
    if (list.action) {
      this.util.showAboutUsModal = true;
    } else {
      this.util.navigateToUrl(list.link);
    }
  };
}

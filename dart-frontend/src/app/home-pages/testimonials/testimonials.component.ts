import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import sal from 'sal.js';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  testimonialOptions!: OwlOptions;
  constructor(){}
  ngOnInit(): void {
    sal();
    const prevArrow = `<span aria-label="Previous" class="prev_btn"><i class="ti ti-arrow-left"></span>`;
    const nextArrow = `<span aria-label="Next" class="next_btn"><i class="ti ti-arrow-right"></span>`;
    this.testimonialOptions = {
      loop: true,
      margin: 10,
      nav: true,
      items: 1,
      navText: ['&lsaquo;', '&rsaquo;'],
      navSpeed: 700,
      responsive: {
        0: {
          items: 1,
        },
        1200: {
          items: 1,
        },
      },
    };
  }

  startDragging = (event: any) => {
    setTimeout(() => {
      /* this.isDragging = event; */
    }, 10);
  };
}

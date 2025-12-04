import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
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
        'It is extremely easy to book a car service appointment in Bangalore. All you need to do is visit the DART website, choose Bangalore from our location option, select the desired service, checkout the service by giving the necessary information and we will pick your car. It is that simple. You can also call us at +91 998-007-7990 and our customer service experts will get back to you.',
    },
    {
      question: 'What makes DART the best car repair garage in Bangalore?',
      answer:
        'DART is the best and most reliable car service center near you in Bangalore. We promise you 100% Satisfaction. Hassle-Free experience, Transparency and Multiple Quality checks to ensure we provide the best service possible. You can find us online on our website and book your car servicing slot instantly to have a convenient and hassle-free car servicing experience in Bangalore.',
    },
  ];

}

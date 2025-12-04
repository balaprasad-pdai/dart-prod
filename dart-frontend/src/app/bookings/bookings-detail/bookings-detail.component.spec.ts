import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsDetailComponent } from './bookings-detail.component';

describe('BookingsDetailComponent', () => {
  let component: BookingsDetailComponent;
  let fixture: ComponentFixture<BookingsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsDetailComponent]
    });
    fixture = TestBed.createComponent(BookingsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

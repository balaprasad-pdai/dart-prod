import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsHistoryDetailComponent } from './bookings-history-detail.component';

describe('BookingsHistoryDetailComponent', () => {
  let component: BookingsHistoryDetailComponent;
  let fixture: ComponentFixture<BookingsHistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsHistoryDetailComponent]
    });
    fixture = TestBed.createComponent(BookingsHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

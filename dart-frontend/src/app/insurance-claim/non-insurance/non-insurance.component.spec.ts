import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonInsuranceComponent } from './non-insurance.component';

describe('NonInsuranceComponent', () => {
  let component: NonInsuranceComponent;
  let fixture: ComponentFixture<NonInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonInsuranceComponent]
    });
    fixture = TestBed.createComponent(NonInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

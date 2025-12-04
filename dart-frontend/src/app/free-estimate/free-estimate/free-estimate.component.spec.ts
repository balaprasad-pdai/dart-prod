import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeEstimateComponent } from './free-estimate.component';

describe('FreeEstimateComponent', () => {
  let component: FreeEstimateComponent;
  let fixture: ComponentFixture<FreeEstimateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeEstimateComponent]
    });
    fixture = TestBed.createComponent(FreeEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

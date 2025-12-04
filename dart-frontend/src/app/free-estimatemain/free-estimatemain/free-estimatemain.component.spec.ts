import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeEstimatemainComponent } from './free-estimatemain.component';

describe('FreeEstimatemainComponent', () => {
  let component: FreeEstimatemainComponent;
  let fixture: ComponentFixture<FreeEstimatemainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeEstimatemainComponent]
    });
    fixture = TestBed.createComponent(FreeEstimatemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

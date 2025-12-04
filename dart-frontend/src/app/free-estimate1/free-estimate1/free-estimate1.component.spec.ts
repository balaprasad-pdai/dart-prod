import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeEstimate1Component } from './free-estimate1.component';

describe('FreeEstimate1Component', () => {
  let component: FreeEstimate1Component;
  let fixture: ComponentFixture<FreeEstimate1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeEstimate1Component]
    });
    fixture = TestBed.createComponent(FreeEstimate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

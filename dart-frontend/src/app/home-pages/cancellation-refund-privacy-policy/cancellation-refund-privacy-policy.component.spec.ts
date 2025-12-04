import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationRefundPrivacyPolicyComponent } from './cancellation-refund-privacy-policy.component';

describe('CancellationRefundPrivacyPolicyComponent', () => {
  let component: CancellationRefundPrivacyPolicyComponent;
  let fixture: ComponentFixture<CancellationRefundPrivacyPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellationRefundPrivacyPolicyComponent],
    });
    fixture = TestBed.createComponent(CancellationRefundPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

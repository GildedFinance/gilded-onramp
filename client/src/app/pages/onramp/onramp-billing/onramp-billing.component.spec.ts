import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampBillingComponent } from './onramp-billing.component';

describe('OnRampBillingComponent', () => {
  let component: OnRampBillingComponent;
  let fixture: ComponentFixture<OnRampBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

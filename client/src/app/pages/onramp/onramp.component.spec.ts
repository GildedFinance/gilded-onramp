import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampComponent } from './onramp.component';

describe('OnRampComponent', () => {
  let component: OnRampComponent;
  let fixture: ComponentFixture<OnRampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

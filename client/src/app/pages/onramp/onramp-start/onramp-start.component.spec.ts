import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampStartComponent } from './onramp-start.component';

describe('OnRampStartComponent', () => {
  let component: OnRampStartComponent;
  let fixture: ComponentFixture<OnRampStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

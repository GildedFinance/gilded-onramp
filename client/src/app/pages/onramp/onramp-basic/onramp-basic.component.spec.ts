import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampBasicComponent } from './onramp-basic.component';

describe('OnRampBasicComponent', () => {
  let component: OnRampBasicComponent;
  let fixture: ComponentFixture<OnRampBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

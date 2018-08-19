import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampFinishComponent } from './onramp-finish.component';

describe('OnRampFinishComponent', () => {
  let component: OnRampFinishComponent;
  let fixture: ComponentFixture<OnRampFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

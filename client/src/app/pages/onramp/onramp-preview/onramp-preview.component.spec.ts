import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampPreviewComponent } from './onramp-preview.component';

describe('OnRampPreviewComponent', () => {
  let component: OnRampPreviewComponent;
  let fixture: ComponentFixture<OnRampPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRampPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

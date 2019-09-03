import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartPerformanceComponent } from './ui-smart-performance.component';

describe('UiSmartPerformanceComponent', () => {
  let component: UiSmartPerformanceComponent;
  let fixture: ComponentFixture<UiSmartPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSmartPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSmartPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

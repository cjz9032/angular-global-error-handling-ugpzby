import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMcafeeFeaturesComponent } from './widget-mcafee-features.component';

describe('WidgetMcafeeFeaturesComponent', () => {
  let component: WidgetMcafeeFeaturesComponent;
  let fixture: ComponentFixture<WidgetMcafeeFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMcafeeFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMcafeeFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

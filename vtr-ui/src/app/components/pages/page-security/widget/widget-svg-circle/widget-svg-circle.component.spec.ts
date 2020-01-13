import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSvgCircleComponent } from './widget-svg-circle.component';

describe('WidgetSvgCircleComponent', () => {
  let component: WidgetSvgCircleComponent;
  let fixture: ComponentFixture<WidgetSvgCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSvgCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSvgCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSpeedometerComponent } from './widget-speedometer.component';

describe('WidgetSpeedometerComponent', () => {
  let component: WidgetSpeedometerComponent;
  let fixture: ComponentFixture<WidgetSpeedometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSpeedometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSpeedometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

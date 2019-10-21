import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDeviceComponent } from './widget-device.component';

xdescribe('WidgetDeviceComponent', () => {
  let component: WidgetDeviceComponent;
  let fixture: ComponentFixture<WidgetDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDeviceComponent ]
    })
    .compileComponents();
  }));
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

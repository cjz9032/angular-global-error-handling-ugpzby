import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiScanScheduleComponent } from './ui-scan-schedule.component';

xdescribe('UiScanScheduleComponent', () => {
  let component: UiScanScheduleComponent;
  let fixture: ComponentFixture<UiScanScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiScanScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiScanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

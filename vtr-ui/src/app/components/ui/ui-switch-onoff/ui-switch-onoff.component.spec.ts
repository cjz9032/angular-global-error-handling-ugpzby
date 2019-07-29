import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSwitchOnoffComponent } from './ui-switch-onoff.component';

xdescribe('UiSwitchOnoffComponent', () => {
  let component: UiSwitchOnoffComponent;
  let fixture: ComponentFixture<UiSwitchOnoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSwitchOnoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSwitchOnoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

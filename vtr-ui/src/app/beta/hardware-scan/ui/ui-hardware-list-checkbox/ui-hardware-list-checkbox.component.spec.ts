import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHardwareListCheckboxComponent } from './ui-hardware-list-checkbox.component';

xdescribe('UiHardwareListCheckboxComponent', () => {
  let component: UiHardwareListCheckboxComponent;
  let fixture: ComponentFixture<UiHardwareListCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiHardwareListCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHardwareListCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

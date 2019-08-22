import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHardwareListTestComponent } from './ui-hardware-list-test.component';

xdescribe('UiHardwareListTestComponent', () => {
  let component: UiHardwareListTestComponent;
  let fixture: ComponentFixture<UiHardwareListTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiHardwareListTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHardwareListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

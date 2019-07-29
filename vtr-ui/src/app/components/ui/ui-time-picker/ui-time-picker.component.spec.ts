import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTimePickerComponent } from './ui-time-picker.component';

xdescribe('UiTimePickerComponent', () => {
  let component: UiTimePickerComponent;
  let fixture: ComponentFixture<UiTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

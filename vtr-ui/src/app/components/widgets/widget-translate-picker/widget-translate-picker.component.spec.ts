import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTranslatePickerComponent } from './widget-translate-picker.component';

describe('WidgetTranslatePickerComponent', () => {
  let component: WidgetTranslatePickerComponent;
  let fixture: ComponentFixture<WidgetTranslatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetTranslatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetTranslatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePickerBaseComponent } from './translate-picker-base.component';

describe('TranslatePickerBaseComponent', () => {
  let component: TranslatePickerBaseComponent;
  let fixture: ComponentFixture<TranslatePickerBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatePickerBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatePickerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

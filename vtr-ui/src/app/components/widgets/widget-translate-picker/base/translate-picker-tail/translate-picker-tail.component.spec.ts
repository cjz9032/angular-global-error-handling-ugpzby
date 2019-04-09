import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePickerTailComponent } from './translate-picker-tail.component';

describe('TranslatePickerTailComponent', () => {
  let component: TranslatePickerTailComponent;
  let fixture: ComponentFixture<TranslatePickerTailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatePickerTailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatePickerTailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

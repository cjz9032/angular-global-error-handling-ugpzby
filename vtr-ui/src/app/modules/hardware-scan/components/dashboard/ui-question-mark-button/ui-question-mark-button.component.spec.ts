import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiQuestionMarkButtonComponent } from './ui-question-mark-button.component';

describe('UiQuestionMarkButtonComponent', () => {
  let component: UiQuestionMarkButtonComponent;
  let fixture: ComponentFixture<UiQuestionMarkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiQuestionMarkButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiQuestionMarkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

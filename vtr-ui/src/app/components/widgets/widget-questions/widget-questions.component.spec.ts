import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetQuestionsComponent } from './widget-questions.component';

describe('WidgetQuestionsComponent', () => {
  let component: WidgetQuestionsComponent;
  let fixture: ComponentFixture<WidgetQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

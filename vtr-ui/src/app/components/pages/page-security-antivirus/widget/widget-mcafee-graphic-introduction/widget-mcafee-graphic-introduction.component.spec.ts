import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMcafeeGraphicIntroductionComponent } from './widget-mcafee-graphic-introduction.component';

describe('WidgetMcafeeGraphicIntroductionComponent', () => {
  let component: WidgetMcafeeGraphicIntroductionComponent;
  let fixture: ComponentFixture<WidgetMcafeeGraphicIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMcafeeGraphicIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMcafeeGraphicIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

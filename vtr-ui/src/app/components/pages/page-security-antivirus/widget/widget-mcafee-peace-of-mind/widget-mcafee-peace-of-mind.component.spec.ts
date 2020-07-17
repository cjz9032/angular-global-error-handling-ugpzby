import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMcafeePeaceOfMindComponent } from './widget-mcafee-peace-of-mind.component';

describe('WidgetMcafeePeaceOfMindComponent', () => {
  let component: WidgetMcafeePeaceOfMindComponent;
  let fixture: ComponentFixture<WidgetMcafeePeaceOfMindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMcafeePeaceOfMindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMcafeePeaceOfMindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

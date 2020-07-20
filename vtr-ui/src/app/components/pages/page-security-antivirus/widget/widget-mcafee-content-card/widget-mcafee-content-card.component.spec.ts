import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMcafeeContentCardComponent } from './widget-mcafee-content-card.component';

describe('WidgetMcafeeContentCardComponent', () => {
  let component: WidgetMcafeeContentCardComponent;
  let fixture: ComponentFixture<WidgetMcafeeContentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMcafeeContentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMcafeeContentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLightingDeskComponent } from './widget-lighting-desk.component';

describe('WidgetLightingDeskComponent', () => {
  let component: WidgetLightingDeskComponent;
  let fixture: ComponentFixture<WidgetLightingDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetLightingDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLightingDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

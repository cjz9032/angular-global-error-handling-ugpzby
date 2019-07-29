import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLightingComponent } from './widget-lighting.component';

xdescribe('WidgetLightingComponent', () => {
  let component: WidgetLightingComponent;
  let fixture: ComponentFixture<WidgetLightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetLightingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

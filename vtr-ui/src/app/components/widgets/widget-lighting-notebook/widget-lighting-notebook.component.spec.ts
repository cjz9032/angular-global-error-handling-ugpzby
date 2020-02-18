import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLightingNotebookComponent } from './widget-lighting-notebook.component';

describe('WidgetLightingNotebookComponent', () => {
  let component: WidgetLightingNotebookComponent;
  let fixture: ComponentFixture<WidgetLightingNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetLightingNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLightingNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

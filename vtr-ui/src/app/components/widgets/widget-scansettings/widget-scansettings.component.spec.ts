import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetScansettingsComponent } from './widget-scansettings.component';

describe('WidgetScansettingsComponent', () => {
  let component: WidgetScansettingsComponent;
  let fixture: ComponentFixture<WidgetScansettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetScansettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetScansettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

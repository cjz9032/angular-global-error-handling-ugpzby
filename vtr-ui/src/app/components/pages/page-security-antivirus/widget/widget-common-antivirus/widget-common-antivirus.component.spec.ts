import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCommonAntivirusComponent } from './widget-common-antivirus.component';

describe('WidgetCommonAntivirusComponent', () => {
  let component: WidgetCommonAntivirusComponent;
  let fixture: ComponentFixture<WidgetCommonAntivirusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCommonAntivirusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCommonAntivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

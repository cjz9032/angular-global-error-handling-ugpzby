import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAboutComponent } from './widget-about.component';

describe('WidgetAboutComponent', () => {
  let component: WidgetAboutComponent;
  let fixture: ComponentFixture<WidgetAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

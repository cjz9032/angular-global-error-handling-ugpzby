import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAutocloseComponent } from './widget-autoclose.component';

describe('WidgetAutocloseComponent', () => {
  let component: WidgetAutocloseComponent;
  let fixture: ComponentFixture<WidgetAutocloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAutocloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAutocloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

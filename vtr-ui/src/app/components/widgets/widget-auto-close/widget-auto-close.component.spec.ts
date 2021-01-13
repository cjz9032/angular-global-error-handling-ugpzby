import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAutoCloseComponent } from './widget-auto-close.component';

describe('WidgetAutoCloseComponent', () => {
  let component: WidgetAutoCloseComponent;
  let fixture: ComponentFixture<WidgetAutoCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetAutoCloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAutoCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

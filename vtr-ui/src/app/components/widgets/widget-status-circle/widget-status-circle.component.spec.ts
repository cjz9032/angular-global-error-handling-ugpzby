import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetStatusCircleComponent } from './widget-status-circle.component';

describe('WidgetStatusCircleComponent', () => {
  let component: WidgetStatusCircleComponent;
  let fixture: ComponentFixture<WidgetStatusCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetStatusCircleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetStatusCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

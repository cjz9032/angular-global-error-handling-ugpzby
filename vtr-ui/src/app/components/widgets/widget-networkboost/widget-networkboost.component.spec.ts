import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetNetworkboostComponent } from './widget-networkboost.component';

describe('WidgetNetworkboostComponent', () => {
  let component: WidgetNetworkboostComponent;
  let fixture: ComponentFixture<WidgetNetworkboostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetNetworkboostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetNetworkboostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

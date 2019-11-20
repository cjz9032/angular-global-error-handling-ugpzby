import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSubscriptiondetailsComponent } from './widget-subscriptiondetails.component';

describe('WidgetSubscriptiondetailsComponent', () => {
  let component: WidgetSubscriptiondetailsComponent;
  let fixture: ComponentFixture<WidgetSubscriptiondetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSubscriptiondetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSubscriptiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

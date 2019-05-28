import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHomeSecurityAccountStatusComponent } from './widget-home-security-account-status.component';

describe('WidgetHomeSecurityAccountStatusComponent', () => {
  let component: WidgetHomeSecurityAccountStatusComponent;
  let fixture: ComponentFixture<WidgetHomeSecurityAccountStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetHomeSecurityAccountStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetHomeSecurityAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

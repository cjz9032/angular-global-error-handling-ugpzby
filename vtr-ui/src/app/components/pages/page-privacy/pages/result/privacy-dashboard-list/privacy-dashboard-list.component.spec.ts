import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyDashboardListComponent } from './privacy-dashboard-list.component';

describe('PrivacyDashboardListComponent', () => {
  let component: PrivacyDashboardListComponent;
  let fixture: ComponentFixture<PrivacyDashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyDashboardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyDashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecurityAccountStatusComponent } from './home-security-account-status.component';

describe('HomeSecurityAccountStatusComponent', () => {
  let component: HomeSecurityAccountStatusComponent;
  let fixture: ComponentFixture<HomeSecurityAccountStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSecurityAccountStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSecurityAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

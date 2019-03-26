import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyTipComponent } from './privacy-tip.component';

describe('PrivacyTipComponent', () => {
  let component: PrivacyTipComponent;
  let fixture: ComponentFixture<PrivacyTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

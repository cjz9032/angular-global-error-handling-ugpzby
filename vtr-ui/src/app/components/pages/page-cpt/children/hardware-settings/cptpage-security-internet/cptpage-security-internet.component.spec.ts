import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageSecurityInternetComponent } from './cptpage-security-internet.component';

describe('CptpageSecurityInternetComponent', () => {
  let component: CptpageSecurityInternetComponent;
  let fixture: ComponentFixture<CptpageSecurityInternetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageSecurityInternetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageSecurityInternetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

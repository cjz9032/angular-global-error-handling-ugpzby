import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageSecurityAntivirusComponent } from './cptpage-security-antivirus.component';

describe('CptpageSecurityAntivirusComponent', () => {
  let component: CptpageSecurityAntivirusComponent;
  let fixture: ComponentFixture<CptpageSecurityAntivirusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageSecurityAntivirusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageSecurityAntivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

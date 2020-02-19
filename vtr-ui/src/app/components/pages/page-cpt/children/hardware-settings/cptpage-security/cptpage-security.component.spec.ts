import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageSecurityComponent } from './cptpage-security.component';

describe('CptpageSecurityComponent', () => {
  let component: CptpageSecurityComponent;
  let fixture: ComponentFixture<CptpageSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageSupportComponent } from './cptpage-support.component';

describe('CptpageSupportComponent', () => {
  let component: CptpageSupportComponent;
  let fixture: ComponentFixture<CptpageSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

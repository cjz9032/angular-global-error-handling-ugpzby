import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageDashboardComponent } from './cptpage-dashboard.component';

describe('CptpageDashboardComponent', () => {
  let component: CptpageDashboardComponent;
  let fixture: ComponentFixture<CptpageDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

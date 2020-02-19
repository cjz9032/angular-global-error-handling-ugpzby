import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageLightingcustomizeComponent } from './cptpage-lightingcustomize.component';

describe('CptpageLightingcustomizeComponent', () => {
  let component: CptpageLightingcustomizeComponent;
  let fixture: ComponentFixture<CptpageLightingcustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageLightingcustomizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageLightingcustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

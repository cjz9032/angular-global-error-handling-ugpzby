import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageMacrokeyComponent } from './cptpage-macrokey.component';

describe('CptpageMacrokeyComponent', () => {
  let component: CptpageMacrokeyComponent;
  let fixture: ComponentFixture<CptpageMacrokeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageMacrokeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageMacrokeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

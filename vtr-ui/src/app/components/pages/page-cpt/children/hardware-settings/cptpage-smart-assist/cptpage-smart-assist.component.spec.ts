import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageSmartAssistComponent } from './cptpage-smart-assist.component';

describe('CptpageSmartAssistComponent', () => {
  let component: CptpageSmartAssistComponent;
  let fixture: ComponentFixture<CptpageSmartAssistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageSmartAssistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageSmartAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

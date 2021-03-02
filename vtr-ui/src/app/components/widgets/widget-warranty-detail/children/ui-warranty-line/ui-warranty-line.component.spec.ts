import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiWarrantyLineComponent } from './ui-warranty-line.component';

describe('UiWarrantyLineComponent', () => {
  let component: UiWarrantyLineComponent;
  let fixture: ComponentFixture<UiWarrantyLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiWarrantyLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiWarrantyLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

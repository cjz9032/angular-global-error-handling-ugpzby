import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiWarrantyIndicatorComponent } from './ui-warranty-indicator.component';

describe('UiWarrantyIndicatorComponent', () => {
  let component: UiWarrantyIndicatorComponent;
  let fixture: ComponentFixture<UiWarrantyIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiWarrantyIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiWarrantyIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

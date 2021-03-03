import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiWarrantyRoundComponent } from './ui-warranty-round.component';

describe('UiWarrantyRoundComponent', () => {
  let component: UiWarrantyRoundComponent;
  let fixture: ComponentFixture<UiWarrantyRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiWarrantyRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiWarrantyRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

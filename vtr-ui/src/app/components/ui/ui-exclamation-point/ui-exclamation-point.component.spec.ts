import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiExclamationPointComponent } from './ui-exclamation-point.component';

describe('UiExclamationPointComponent', () => {
  let component: UiExclamationPointComponent;
  let fixture: ComponentFixture<UiExclamationPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiExclamationPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiExclamationPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

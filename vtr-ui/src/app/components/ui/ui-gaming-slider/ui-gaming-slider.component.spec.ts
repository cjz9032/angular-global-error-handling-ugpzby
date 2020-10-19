import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiGamingSliderComponent } from './ui-gaming-slider.component';

describe('UiGamingSliderComponent', () => {
  let component: UiGamingSliderComponent;
  let fixture: ComponentFixture<UiGamingSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiGamingSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiGamingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

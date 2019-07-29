import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiGamingDriverPopupComponent } from './ui-gaming-driver-popup.component';

xdescribe('UiGamingDriverPopupComponent', () => {
  let component: UiGamingDriverPopupComponent;
  let fixture: ComponentFixture<UiGamingDriverPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiGamingDriverPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiGamingDriverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLightingKeyboardLNBx50Component } from './ui-lighting-keyboard-lnbx50.component';

describe('UiLightingKeyboardLNBx50Component', () => {
  let component: UiLightingKeyboardLNBx50Component;
  let fixture: ComponentFixture<UiLightingKeyboardLNBx50Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiLightingKeyboardLNBx50Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLightingKeyboardLNBx50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

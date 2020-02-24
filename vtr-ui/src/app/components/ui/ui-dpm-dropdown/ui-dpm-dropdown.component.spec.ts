import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDpmDropdownComponent } from './ui-dpm-dropdown.component';

describe('UiDpmDropdownComponent', () => {
  let component: UiDpmDropdownComponent;
  let fixture: ComponentFixture<UiDpmDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiDpmDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDpmDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

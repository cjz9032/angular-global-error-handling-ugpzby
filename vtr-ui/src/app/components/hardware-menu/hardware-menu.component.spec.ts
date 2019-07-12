import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareMenuComponent } from './hardware-menu.component';

describe('HardwareMenuComponent', () => {
  let component: HardwareMenuComponent;
  let fixture: ComponentFixture<HardwareMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

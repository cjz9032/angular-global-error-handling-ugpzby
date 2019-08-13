import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareComponentsComponent } from './hardware-components.component';

describe('HardwareComponentsComponent', () => {
  let component: HardwareComponentsComponent;
  let fixture: ComponentFixture<HardwareComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

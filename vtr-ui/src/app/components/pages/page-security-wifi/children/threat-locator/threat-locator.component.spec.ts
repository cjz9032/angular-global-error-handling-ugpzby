import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatLocatorComponent } from './threat-locator.component';

describe('ThreatLocatorComponent', () => {
  let component: ThreatLocatorComponent;
  let fixture: ComponentFixture<ThreatLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

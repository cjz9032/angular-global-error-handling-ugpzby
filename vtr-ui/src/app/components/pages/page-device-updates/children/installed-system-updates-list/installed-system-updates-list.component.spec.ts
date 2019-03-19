import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalledSystemUpdatesListComponent } from './installed-system-updates-list.component';

describe('InstalledSystemUpdatesListComponent', () => {
  let component: InstalledSystemUpdatesListComponent;
  let fixture: ComponentFixture<InstalledSystemUpdatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstalledSystemUpdatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstalledSystemUpdatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

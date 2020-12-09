import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSnapshotListInfoComponent } from './ui-snapshot-list-info.component';

describe('UiSnapshotListInfoComponent', () => {
  let component: UiSnapshotListInfoComponent;
  let fixture: ComponentFixture<UiSnapshotListInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiSnapshotListInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSnapshotListInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

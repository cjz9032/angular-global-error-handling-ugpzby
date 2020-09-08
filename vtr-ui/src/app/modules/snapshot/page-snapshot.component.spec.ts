import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSnapshotComponent } from './page-snapshot.component';

describe('PageSnapshotComponent', () => {
  let component: PageSnapshotComponent;
  let fixture: ComponentFixture<PageSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

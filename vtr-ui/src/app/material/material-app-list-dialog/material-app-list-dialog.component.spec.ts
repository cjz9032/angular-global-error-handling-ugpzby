import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAppListDialogComponent } from './material-app-list-dialog.component';

describe('MaterialAppListDialogComponent', () => {
  let component: MaterialAppListDialogComponent;
  let fixture: ComponentFixture<MaterialAppListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAppListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAppListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

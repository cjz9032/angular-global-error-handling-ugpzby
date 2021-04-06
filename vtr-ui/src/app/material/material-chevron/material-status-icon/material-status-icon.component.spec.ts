import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusIconComponent } from './material-status-icon.component';

describe('MaterialStatusIconComponent', () => {
  let component: MaterialStatusIconComponent;
  let fixture: ComponentFixture<MaterialStatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialStatusIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

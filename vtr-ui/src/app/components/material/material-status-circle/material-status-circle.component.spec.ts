import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusCircleComponent } from './material-status-circle.component';

describe('MaterialStatusCircleComponent', () => {
  let component: MaterialStatusCircleComponent;
  let fixture: ComponentFixture<MaterialStatusCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialStatusCircleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

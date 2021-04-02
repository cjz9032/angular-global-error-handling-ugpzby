import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialChevronListComponent } from './material-chevron-list.component';

describe('MaterialChevronListComponent', () => {
  let component: MaterialChevronListComponent;
  let fixture: ComponentFixture<MaterialChevronListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialChevronListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialChevronListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

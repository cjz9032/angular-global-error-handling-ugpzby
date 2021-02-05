import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentLibraryComponent } from './page-content-library.component';

describe('PageContentLibraryComponent', () => {
  let component: PageContentLibraryComponent;
  let fixture: ComponentFixture<PageContentLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageContentLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
